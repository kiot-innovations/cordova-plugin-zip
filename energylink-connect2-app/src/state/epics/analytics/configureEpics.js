import { ofType } from 'redux-observable'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import { EMPTY, of } from 'rxjs'
import {
  compose,
  curry,
  not,
  always,
  cond,
  path,
  pathOr,
  propEq,
  T,
  prop
} from 'ramda'

import { commissionSite, saveConfiguration } from 'shared/analytics'
import { parseInventory } from 'state/epics/analytics/InventoryEpics'
import { COMMISSION_SUCCESS } from 'state/actions/analytics'
import { getElapsedTime } from 'shared/utils'
import {
  SUBMIT_COMMISSION_ERROR,
  SUBMIT_COMMISSION_SUCCESS
} from 'state/actions/systemConfiguration'

const pathNA = pathOr('N/A')
const getRse = pathNA(['systemConfiguration', 'rse', 'selectedPowerProduction'])

const getESSOperationalMode = pathNA([
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

export const getGridProfile = pathNA([
  'systemConfiguration',
  'gridBehavior',
  'selectedOptions',
  'profile',
  'name'
])

export const getConsumptionMeterType = pathNA([
  'systemConfiguration',
  'meter',
  'consumptionCT'
])

const getConnectionInterfaces = state => {
  const networkInterfaces = pathOr(
    [],
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

export const getProductionMeterType = pathNA([
  'systemConfiguration',
  'meter',
  'productionCT'
])

export const getGridVoltage = pathNA([
  'systemConfiguration',
  'gridBehavior',
  'gridVoltage',
  'selected'
])

/**
 * Generates an object to send to mixpanel
 * @param state
 * @param {boolean}success
 * @param {({error:string,message:string} | null)}error
 * @return {Action<null, null> | Action<unknown, {}>}
 */
const getConfiguration = (state, success, error) => {
  const errorMessage = prop('message', error)
  const errorCode = prop('code', error)
  const inventory = parseInventory(path(['inventory', 'bom'], state))
  const hasESS = not(propEq('ESS', '0', inventory))
  const networkInterfaces = getConnectionInterfaces(state)

  const essProperties = {
    'Storage Operation Mode': getESSOperationalMode(state),
    'Storage Reserve Amount': getESSReserveAmount(state)
  }
  const errorProperties = {
    'Error Message': errorMessage,
    'Error Code': errorCode
  }

  const timePassedChoosing = getElapsedTime(state.analytics.configureTimer)
  const EDPEndpointDuration = getElapsedTime(state.analytics.submitTimer)
  const { reconnectionTimes } = state.analytics

  const acpvProperties = {
    ...(error ? errorProperties : {}),
    ...networkInterfaces,
    'Grid Profile': getGridProfile(state),
    'Grid Voltage': getGridVoltage(state),
    'Production Meter Type': getProductionMeterType(state),
    'Consumption Meter Type': getConsumptionMeterType(state),
    'Remote System Energize': getRse(state),
    Success: success,
    'Time Elapsed Choosing': timePassedChoosing,
    'Time Elapsed Submitting': EDPEndpointDuration,
    'Reconnections To PVS WiFi': reconnectionTimes
  }

  return saveConfiguration(
    hasESS ? { ...acpvProperties, ...essProperties } : acpvProperties
  )
}

const submitConfigurationSuccess = (action$, state$) =>
  action$.pipe(
    ofType(SUBMIT_COMMISSION_SUCCESS.getType()),
    withLatestFrom(state$),
    switchMap(([, state]) => of(getConfiguration(state, true, null)))
  )

const submitConfigurationError = (action$, state$) =>
  action$.pipe(
    ofType(SUBMIT_COMMISSION_ERROR.getType()),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) =>
      of(getConfiguration(state, false, payload))
    )
  )

const getElapsedTimeWithState = curry((state, timerName) =>
  compose(
    getElapsedTime,
    pathOr(new Date().getTime(), ['value', 'analytics', timerName])
  )(state)
)
const getReconnectionTimes = pathOr(0, [
  'value',
  'network',
  'reconnectionTimes'
])

export const submitCommissionSuccess = (action$, state$) =>
  action$.pipe(
    ofType(SUBMIT_COMMISSION_SUCCESS.getType()),
    switchMap(() => {
      if (state$.value.analytics.commissioningSuccess) return EMPTY
      const getTime = getElapsedTimeWithState(state$)

      const duration = getTime('commissioningTimer')
      const timeConfiguring = getTime('configureTimer')
      const timeFromMiScan = getTime('timeFromMiScan')

      const reconnectionTimes = getReconnectionTimes(state$)

      return of(
        commissionSite({
          duration,
          timeConfiguring,
          timeFromMiScan,
          reconnectionTimes
        }),
        COMMISSION_SUCCESS()
      )
    })
  )

export default [
  submitConfigurationSuccess,
  submitConfigurationError,
  submitCommissionSuccess
]
