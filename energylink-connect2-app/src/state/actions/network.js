import { createAction } from 'redux-act'

export const PVS_CONNECTION_INIT = createAction('PVS_CONNECTION_INIT')
export const PVS_CONNECTION_SUCCESS = createAction('PVS_CONNECTION_SUCCESS')
export const PVS_CONNECTION_ERROR = createAction('PVS_CONNECTION_ERROR')
export const PVS_CONNECTION_CLOSE = createAction('PVS_CONNECTION_CLOSE')
export const PVS_CONNECTION_CLOSE_FINISHED = createAction(
  'PVS_CONNECTION_CLOSE_FINISHED'
)
export const PVS_CLEAR_ERROR = createAction('PVS_CLEAR_ERROR')
export const STOP_NETWORK_POLLING = createAction('STOP_NETWORK_POLLING')
export const WAIT_FOR_SWAGGER = createAction('WAIT_FOR_SWAGGER')
export const WAITING_FOR_SWAGGER = createAction('WAITING_FOR_SWAGGER')
export const GET_AVAILABLE_NETWORKS = createAction('GET AVAILABLE NETWORKS')
export const RESET_PVS_CONNECTION = createAction('RESET_PVS_CONNECTION')
export const STOP_POLLING_AVAILABLE_NETWORKS = createAction(
  'GET AVAILABLE NETWORKS'
)
export const clearPVSErr = () => {
  return async dispatch => {
    dispatch(PVS_CLEAR_ERROR())
  }
}
export const PVS_TIMEOUT_FOR_CONNECTION = createAction(
  'PVS_TIMEOUT_FOR_CONNECTION'
)
export const ENABLE_ACCESS_POINT = createAction('ENABLE_ACCESS_POINT')
export const HIDE_ENABLING_ACCESS_POINT = createAction(
  'HIDE_ENABLING_ACCESS_POINT'
)
export const CONNECT_PVS_VIA_BLE = createAction('CONNECT_PVS_VIA_BLE')
export const EXECUTE_ENABLE_ACCESS_POINT = createAction(
  'EXECUTE_ENABLE_ACCESS_POINT'
)
export const EXECUTE_ENABLE_ACCESS_POINT_SUCCESS = createAction(
  'EXECUTE_ENABLE_ACCESS_POINT_SUCCESS'
)

export const FAILURE_BLUETOOTH_ACTION = createAction('FAILURE_BLUETOOTH_ACTION')

export const ENABLE_BLUETOOTH_INIT = createAction('ENABLE_BLUETOOTH_INIT')
export const ENABLE_BLUETOOTH_SUCCESS = createAction('ENABLE_BLUETOOTH_SUCCESS')
export const ENABLE_BLUETOOTH_ERROR = createAction('ENABLE_BLUETOOTH_ERROR')

export const CHECK_BLUETOOTH_STATUS_INIT = createAction(
  'CHECK_BLUETOOTH_STATUS_INIT'
)
export const CHECK_BLUETOOTH_STATUS_SUCCESS = createAction(
  'CHECK_BLUETOOTH_STATUS_SUCCESS'
)
export const CHECK_WIFI_STATUS_INIT = createAction('CHECK_WIFI_STATUS_INIT')
export const CHECK_WIFI_STATUS_SUCCESS = createAction(
  'CHECK_WIFI_STATUS_SUCCESS'
)
export const CHECK_WIFI_STATUS_ERROR = createAction('CHECK_WIFI_STATUS_ERROR')
export const RESET_BLUETOOTH_STATUS = createAction('RESET_BLUETOOTH_STATUS')
export const RESET_WIFI_STATUS = createAction('RESET_WIFI_STATUS')
