import { ofType } from 'redux-observable'
import { EMPTY, of } from 'rxjs'
import { switchMap, withLatestFrom } from 'rxjs/operators'
import { not, always, cond, path, pathOr, propEq, T } from 'ramda'

import { commissionSite, saveConfiguration } from 'shared/analytics'
import { getElapsedTimeWithState } from 'shared/analyticsUtils'

import {
  SUBMIT_COMMISSION_ERROR,
  SUBMIT_COMMISSION_SUCCESS
} from 'state/actions/systemConfiguration'
import { parseInventory } from 'state/epics/analytics/InventoryEpics'
import { COMMISSION_SUCCESS } from 'state/actions/analytics'
import { getElapsedTime } from 'shared/utils'

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

const getGridProfile = pathNA([
  'systemConfiguration',
  'gridBehavior',
  'selectedOptions',
  'profile',
  'name'
])
const getConsumptionMeterType = pathNA([
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

const getProductionMeterType = pathNA([
  'systemConfiguration',
  'meter',
  'productionCT'
])
const getGridVoltage = pathNA([
  'systemConfiguration',
  'gridBehavior',
  'gridVoltage',
  'selected'
])

const getConfiguration = (state, success, errorMessage) => {
  const inventory = parseInventory(path(['inventory', 'bom'], state))
  const hasESS = not(propEq('ESS', '0', inventory))
  const networkInterfaces = getConnectionInterfaces(state)

  const essProperties = {
    'Storage Operation Mode': getESSOperationalMode(state),
    'Storage Reserve Amount': getESSReserveAmount(state)
  }

  const timePassedChoosing = getElapsedTime(state.analytics.configureTimer)
  const EDPEndpointDuration = getElapsedTime(state.analytics.submitTimer)
  const { reconnectionTimes } = state.analytics

  const acpvProperties = {
    ...networkInterfaces,
    'Grid Profile': getGridProfile(state),
    'Grid Voltage': getGridVoltage(state),
    'Production Meter Type': getProductionMeterType(state),
    'Consumption Meter Type': getConsumptionMeterType(state),
    'Remote System Energize': getRse(state),
    Success: success,
    'Error Message': errorMessage,

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
