import { createAction } from 'redux-act'

export const PVS_CONNECTION_INIT = createAction('PVS_CONNECTION_INIT')
export const PVS_CONNECTION_SUCCESS = createAction('PVS_CONNECTION_SUCCESS')
export const PVS_CONNECTION_ERROR = createAction('PVS_CONNECTION_ERROR')

export const connectTo = (ssid, password) => {
  return async dispatch => {
    dispatch(PVS_CONNECTION_INIT())
    if (window.device.platform === 'iOS') {
      await window.WifiWizard2.iOSConnectNetwork(ssid, password)
        .then(() => {
          dispatch(PVS_CONNECTION_SUCCESS(ssid))
        })
        .catch(err => {
          dispatch(PVS_CONNECTION_ERROR(err))
        })
    } else {
      window.WifiWizard2.connect(ssid, true, password, 'WPA', false)
        .then(() => {
          dispatch(PVS_CONNECTION_SUCCESS(ssid))
        })
        .catch(err => {
          dispatch(PVS_CONNECTION_ERROR(err))
        })
    }
  }
}
