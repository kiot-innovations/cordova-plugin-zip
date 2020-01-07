import { createAction } from 'redux-act'

export const PVS_CONNECTION_INIT = createAction('PVS_CONNECTION_INIT')
export const PVS_CONNECTION_SUCCESS = createAction('PVS_CONNECTION_SUCCESS')
export const PVS_CONNECTION_ERROR = createAction('PVS_CONNECTION_ERROR')
export const PVS_CLEAR_ERROR = createAction('PVS_CLEAR_ERROR')
export const STOP_NETWORK_POLLING = createAction('STOP_NETWORK_POLLING')

export const connectTo = (ssid, password) => {
  const IOS = 'iOS'
  const WPA = 'WPA'

  return async dispatch => {
    dispatch(PVS_CONNECTION_INIT())
    try {
      if (window.device.platform === IOS) {
        await window.WifiWizard2.iOSConnectNetwork(ssid, password)
        dispatch(PVS_CONNECTION_SUCCESS(ssid, password))
      } else {
        await window.WifiWizard2.connect(ssid, true, password, WPA, false)
        dispatch(PVS_CONNECTION_SUCCESS(ssid, password))
      }
    } catch (err) {
      dispatch(PVS_CONNECTION_ERROR(err))
    }
  }
}

export const clearPVSErr = () => {
  return async dispatch => {
    dispatch(PVS_CLEAR_ERROR())
  }
}
