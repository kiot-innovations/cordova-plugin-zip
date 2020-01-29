import { createAction } from 'redux-act'

export const GET_NETWORK_APS_INIT = createAction('GET_NETWORK_APS_INIT')
export const GET_NETWORK_APS_SUCCESS = createAction('GET_NETWORK_APS_SUCCESS')
export const GET_NETWORK_APS_ERROR = createAction('GET_NETWORK_APS_ERROR')

export const CONNECT_NETWORK_AP_INIT = createAction('CONNECT_NETWORK_AP_INIT')
export const CONNECT_NETWORK_AP_SUCCESS = createAction(
  'CONNECT_NETWORK_AP_SUCCESS'
)
export const CONNECT_NETWORK_AP_ERROR = createAction('CONNECT_NETWORK_AP_ERROR')
