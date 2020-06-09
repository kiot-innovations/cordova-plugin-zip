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
