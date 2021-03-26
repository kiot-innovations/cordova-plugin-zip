import { ofType } from 'redux-observable'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import { EMPTY, of } from 'rxjs'
import {
  SUBMIT_COMMISSION_ERROR,
  SUBMIT_COMMISSION_SUCCESS
} from 'state/actions/systemConfiguration'
import { compose, curry, always, cond, path, pathOr, propEq, T } from 'ramda'
import { commissionSite, saveConfiguration } from 'shared/analytics'
import { COMMISSION_SUCCESS } from 'state/actions/analytics'
import { getElapsedTime } from 'shared/utils'

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
    return {
      ...acc,
      [networkInterface]: curr.internet === 'up'
    }
  }, {})
}

const getConfiguration = (state, success, errorMessage) => {
  const networkInterfaces = getConnectionInterfaces(state)

  const timePassedChoosing = getElapsedTime(state.analytics.configureTimer)
  const EDPEndpointDuration = getElapsedTime(state.analytics.submitTimer)

  const configEvent = {
    ...networkInterfaces,
    'Grid Profile': getGridProfile(state),
    'Consumption Meter Type': getConsumptionMeterType(state),
    'Remote System Energize': getRse(state),
    Success: success,
    'Error Message': errorMessage,
    'Commissioning Success': success,
    'Storage Operation Mode': getESSOperationalMode(state),
    'Storage Reserve Amount': getESSReserveAmount(state),
    'Time Elapsed Choosing': timePassedChoosing,
    'Time Elapsed Submitting': EDPEndpointDuration
  }

  return saveConfiguration(configEvent)
}

const submitConfigurationSuccess = (action$, state$) =>
  action$.pipe(
    ofType(SUBMIT_COMMISSION_SUCCESS.getType()),
    withLatestFrom(state$),
    switchMap(([, state]) => of(getConfiguration(state, true)))
  )

const submitConfigurationError = (action$, state$) =>
  action$.pipe(
    ofType(SUBMIT_COMMISSION_ERROR.getType()),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) =>
      of(getConfiguration(state, false, payload))
    )
  )

const getElapsedTimeWithState = curry((timerName, state) =>
  compose(
    getElapsedTime,
    pathOr(new Date().getTime(), ['value', 'analytics', timerName])
  )(state)
)
export const submitCommissionSuccess = (action$, state$) =>
  action$.pipe(
    ofType(SUBMIT_COMMISSION_SUCCESS.getType()),
    switchMap(() => {
      if (state$.value.analytics.commissioningSuccess) return EMPTY

      const duration = getElapsedTimeWithState('commissioningTimer', state$)
      const timeConfiguring = getElapsedTimeWithState('configureTimer', state$)
      const timeFromMiScan = getElapsedTimeWithState('timeFromMiScan', state$)

      return of(
        commissionSite({ duration, timeConfiguring, timeFromMiScan }),
        COMMISSION_SUCCESS()
      )
    })
  )

export default [
  submitConfigurationSuccess,
  submitConfigurationError,
  submitCommissionSuccess
]
