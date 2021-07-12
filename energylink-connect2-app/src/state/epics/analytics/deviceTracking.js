import {
  compose,
  last,
  split,
  prop,
  equals,
  toLower,
  path,
  defaultTo,
  propOr,
  pathOr
} from 'ramda'
import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { withLatestFrom, switchMap, filter } from 'rxjs/operators'

import { trackDeviceClaiming } from 'shared/analytics'
import { getElapsedTime } from 'shared/utils'
import { CLAIM_DEVICES_MIXPANEL_EVENT } from 'state/actions/analytics'
import { UPDATE_DEVICES_LIST } from 'state/actions/devices'

export const getTimePassedState = (propertyName, state) =>
  compose(
    getElapsedTime,
    path(['analytics', 'claimingDevices', propertyName])
  )(state)

export const isProductionMeter = compose(
  equals('p'),
  toLower,
  last,
  split(''),
  prop('MODEL'),
  defaultTo({ MODEL: 'N/A' })
)
export const isMeter = compose(
  equals('power meter'),
  toLower,
  prop('DEVICE_TYPE')
)
export const isInverter = compose(
  equals('inverter'),
  toLower,
  prop('DEVICE_TYPE')
)
export const parseDevicesObject = devices => {
  const parsedObj = {
    miClaimedSN: [],
    typesMiClaimed: [],
    prodMeter: [],
    consumptionMeter: []
  }
  devices.forEach(device => {
    if (isMeter(device))
      if (isProductionMeter(device))
        parsedObj.prodMeter = [...parsedObj.prodMeter, device.SERIAL]
      else
        parsedObj.consumptionMeter = [
          ...parsedObj.consumptionMeter,
          device.SERIAL
        ]
    if (isInverter(device)) {
      parsedObj.typesMiClaimed = [...parsedObj.typesMiClaimed, device.MODEL]
      parsedObj.miClaimedSN = [...parsedObj.miClaimedSN, device.SERIAL]
    }
  })
  parsedObj.typesMiClaimed = [...new Set(parsedObj.typesMiClaimed)]
  return parsedObj
}
const trackingErrors = state => {
  const devicesState = prop('devices', state)
  if (!devicesState.claimError) return {}
  return {
    retryDuration: getTimePassedState('claimDeviceErrorTimer', state),
    errorMessage: propOr('ERROR N/A', 'claimError', state)
  }
}

export const trackModelsEpic = (action$, state$) =>
  action$.pipe(
    ofType(UPDATE_DEVICES_LIST.getType()),
    withLatestFrom(state$),
    filter(
      ([, state]) =>
        state.analytics.claimingDevices.status === 'waiting device update'
    ),
    switchMap(([, state]) =>
      of(
        trackDeviceClaiming({
          duration: path(
            ['analytics', 'claimingDevices', 'claimingTime'],
            state
          ),
          ...parseDevicesObject(pathOr([], ['devices', 'found'], state)),
          ...trackingErrors(state$.value),
          httpResponseCode: 200,
          success: true
        }),
        CLAIM_DEVICES_MIXPANEL_EVENT()
      )
    )
  )

export default [trackModelsEpic]
