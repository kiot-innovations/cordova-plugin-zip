import { ofType } from 'redux-observable'
import { exhaustMap, map, switchMap, takeUntil } from 'rxjs/operators'
import { combineLatest, interval, race, ReplaySubject } from 'rxjs'
import { COMMISSIONING_START, CONFIG_START } from 'state/actions/analytics'
import {
  SUBMIT_COMMISSION_ERROR,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS
} from 'state/actions/systemConfiguration'
import { always, cond, path, propEq, T } from 'ramda'
import { EMPTY_ACTION } from 'state/actions/share'
import { saveConfiguration } from 'shared/analytics'

const getRse = path(['systemConfiguration', 'rse', 'selectedPowerProduction'])
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
    [propEq('interface', 'cell'), always('Has cellular')],
    [propEq('interface', 'wan'), always('Has ethernet')],
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

export const getTimeElapsedSubmittingEDP = (action$, state$) => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    exhaustMap(() =>
      race(
        submitConfig(
          action$,
          state$,
          SUBMIT_COMMISSION_SUCCESS.getType(),
          true
        ),
        submitConfig(action$, state$, SUBMIT_COMMISSION_ERROR.getType(), false)
      )
    )
  )
}

const submitConfig = (action$, state$, submitAction, isSuccess) =>
  action$.pipe(
    ofType(submitAction),
    switchMap(({ payload }) =>
      combineLatest([
        timePassedConfiguring$,
        timePassedCommissionEndpoint$,
        state$,
        timePassedCommission$
      ]).pipe(
        map(data => {
          const [
            timeElapsedConfiguring,
            timeEDPEndpoint,
            state,
            timePassedCommissioning
          ] = data
          const rse = getRse(state)
          const gridProfile = getGridProfile(state)
          const meterType = getConsumptionMeterType(state)
          const networkInterfaces = getConnectionInterfaces(state)

          const configEvent = {
            ...networkInterfaces,
            'Grid profile': gridProfile,
            'Consumption meter type': meterType,
            'Remote system energize': rse,
            'Time elapsed choosing': timeElapsedConfiguring,
            'Time elapsed submitting': timeEDPEndpoint,
            Success: isSuccess,
            'Error message': payload,
            'Time to complete commissioning': timePassedCommissioning,
            'Commissioning success': isSuccess
          }
          return saveConfiguration(configEvent)
        })
      )
    )
  )

export default [
  getTimeElapsedSubmittingEDP,
  getTimeElapsedChoosingOption,
  siteConfigurationEpic,
  getTimeCommissioning
]
