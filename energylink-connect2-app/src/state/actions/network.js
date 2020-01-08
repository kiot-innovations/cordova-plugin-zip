import { createAction } from 'redux-act'

export const PVS_CONNECTION_INIT = createAction('PVS_CONNECTION_INIT')
export const PVS_CONNECTION_SUCCESS = createAction('PVS_CONNECTION_SUCCESS')
export const PVS_CONNECTION_ERROR = createAction('PVS_CONNECTION_ERROR')
export const PVS_CLEAR_ERROR = createAction('PVS_CLEAR_ERROR')
export const STOP_NETWORK_POLLING = createAction('STOP_NETWORK_POLLING')

export const clearPVSErr = () => {
  return async dispatch => {
    dispatch(PVS_CLEAR_ERROR())
  }
}
