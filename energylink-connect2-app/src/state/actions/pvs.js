import { createAction } from 'redux-act'

export const SAVE_PVS_SN = createAction('SAVE_PVS_SN')
export const GET_SN_INIT = createAction('GET_SN_INIT')
export const GET_SN_SUCCESS = createAction('GET_SN_SUCCESS')
export const GET_SN_ERROR = createAction('GET_SN_ERROR')
export const SET_TAKEN_IMAGE = createAction('SET_TAKEN_IMAGE')

export const saveSerialNumber = serialNumber => {
  return dispatch => {
    dispatch(SAVE_PVS_SN(serialNumber))
  }
}
