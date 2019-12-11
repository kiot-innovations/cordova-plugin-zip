import { createAction } from 'redux-act'

export const SAVE_PVS_SN = createAction('SAVE_PVS_SN')

export const saveSerialNumber = serialNumber => {
  return dispatch => {
    dispatch(SAVE_PVS_SN(serialNumber))
  }
}
