import { ofType } from 'redux-observable'
import { exhaustMap, map, switchMap, take, takeUntil } from 'rxjs/operators'
import { combineLatest, interval, race, ReplaySubject } from 'rxjs'
import { COMMISSIONING_START, CONFIG_START } from 'state/actions/analytics'
import {
  SUBMIT_COMMISSION_ERROR,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS
} from 'state/actions/systemConfiguration'
import { always, cond, path, pathOr, propEq, T } from 'ramda'
import { EMPTY_ACTION } from 'state/actions/share'
import { saveConfiguration } from 'shared/analytics'

const getRse = path(['systemConfiguration', 'rse', 'selectedPowerProduction'])

const getESSOperationalMode = path([
  'storage',
  'status',
  'results',
  'ess_report',
  'ess_state',
  0,
  'operational_mode'
])

const getESSReserveAmount = state => {
  const liveData = Object.entries(
    pathOr({}, ['energyLiveData', 'liveData'], state)
  )
  if (liveData.length) {
    const [, latest] = liveData[liveData.length - 1]
    return latest.soc
  }
  return undefined
}

const getGridProfile = path([
  'systemConfiguration',
  'gridBehavior',
  'selectedOptions',
  'profile',
  'name'
])
const getConsumptionMeterType = path([
  'systemConfiguration',
  'meter',
  'consumptionCT'
])

const getConnectionInterfaces = state => {
  const networkInterfaces = path(
    ['systemConfiguration', 'interfaces', 'data'],
    state
  )
  const getInterface = cond([
    [propEq('interface', 'sta0'), always('Has Wi-Fi')],
    [propEq('interface', 'cell'), always('Has Cellular')],
    [propEq('interface', 'wan'), always('Has Ethernet')],
    [T, always(null)]
  ])
  return networkInterfaces.reduce((acc, curr) => {
    const networkInterface = getInterface(curr)
    if (!networkInterface) return acc
    return { ...acc, [networkInterface]: curr.internet === 'up' }
  }, {})
}

const timePassedCommissionEndpoint$ = new ReplaySubject(1)

export const getTimeElapsedChoosingOption = action$ => {
  return action$.pipe(
    ofType(CONFIG_START.getType()),
    switchMap(() => {
      timePassedCommissionEndpoint$.next(0)
      return interval(1000).pipe(
        map(timePassed => {
          timePassedCommissionEndpoint$.next(timePassed)
          return EMPTY_ACTION('TIME PASSED SEND COMMISION EDP')
        }),
        takeUntil(action$.pipe(ofType(SUBMIT_CONFIG.getType())))
      )
    })
  )
}

const timePassedCommission$ = new ReplaySubject(1)

export const getTimeCommissioning = action$ => {
  return action$.pipe(
    ofType(COMMISSIONING_START.getType()),
    switchMap(() => {
      timePassedCommission$.next(0)
      return interval(1000).pipe(
        map(timePassed => {
          timePassedCommission$.next(timePassed)
          return EMPTY_ACTION('TIME PASSED COMMISSIONING')
        }),
        takeUntil(action$.pipe(ofType(SUBMIT_CONFIG.getType())))
      )
    })
  )
}

const timePassedConfiguring$ = new ReplaySubject(1)

export const siteConfigurationEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG_SUCCESS.getType()),
    switchMap(() => {
      timePassedConfiguring$.next(0)
      return interval(1000).pipe(
        map(timePassed => {
          timePassedConfiguring$.next(timePassed)
          return EMPTY_ACTION('Time passed configuring')
        }),
        takeUntil(
          action$.pipe(
            ofType(
              SUBMIT_COMMISSION_SUCCESS.getType(),
              SUBMIT_COMMISSION_ERROR.getType()
            )
          )
        )
      )
    })
  )
}

const getData = (data, success, errorMessage) => {
  const [
    timeElapsedConfiguring,
    timeEDPEndpoint,
    state,
    timePassedCommissioning
  ] = data
  const networkInterfaces = getConnectionInterfaces(state)
  const configEvent = {
    ...networkInterfaces,
    'Grid Profile': getGridProfile(state),
    'Consumption Meter Type': getConsumptionMeterType(state),
    'Remote System Energize': getRse(state),
    'Time Elapsed Choosing': timeElapsedConfiguring,
    'Time Elapsed Submitting': timeEDPEndpoint,
    Success: success,
    'Error Message': errorMessage,
    'Time To Complete Commissioning': timePassedCommissioning,
    'Commissioning Success': success,
    'Storage Operation Mode': getESSOperationalMode(state),
    'Storage Reserve Amount': getESSReserveAmount(state)
  }
  return saveConfiguration(configEvent)
}

export const getTimeElapsedSubmittingEDP = (action$, state$) => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    exhaustMap(() =>
      race(
        action$.pipe(
          ofType(SUBMIT_COMMISSION_SUCCESS.getType()),
          switchMap(({ payload }) =>
            combineLatest([
              timePassedConfiguring$,
              timePassedCommissionEndpoint$,
              state$,
              timePassedCommission$
            ]).pipe(map(data => getData(data, true)))
          ),
          take(1)
        ),
        action$.pipe(
          ofType(SUBMIT_COMMISSION_ERROR.getType()),
          switchMap(({ payload }) =>
            combineLatest([
              timePassedConfiguring$,
              timePassedCommissionEndpoint$,
              state$,
              timePassedCommission$
            ]).pipe(map(a => getData(a, false, payload)))
          ),
          take(1)
        )
      )
    )
  )
}

export default [
  getTimeElapsedSubmittingEDP,
  getTimeElapsedChoosingOption,
  siteConfigurationEpic,
  getTimeCommissioning
]
