import { createAction } from 'redux-act'

export const PVS_CONNECTION_INIT = createAction('PVS_CONNECTION_INIT')
export const PVS_CONNECTION_SUCCESS = createAction('PVS_CONNECTION_SUCCESS')
export const PVS_CONNECTION_ERROR = createAction('PVS_CONNECTION_ERROR')

export const connectTo = (ssid, password) => {
  const IOS = 'iOS'
  const WPA = 'WPA'

  return async dispatch => {
    dispatch(PVS_CONNECTION_INIT())
    try {
      if (window.device.platform === IOS) {
        await window.WifiWizard2.iOSConnectNetwork(ssid, password)
        dispatch(PVS_CONNECTION_SUCCESS(ssid))
      } else {
        await window.WifiWizard2.connect(ssid, true, password, WPA, false)
        dispatch(PVS_CONNECTION_SUCCESS(ssid))
      }
    } catch (err) {
      dispatch(PVS_CONNECTION_ERROR(err))
    }
  }
}
