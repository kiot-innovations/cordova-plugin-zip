import { createReducer } from 'redux-act'

import {
  SAVE_PVS_SN,
  GET_SN_INIT,
  GET_SN_SUCCESS,
  GET_SN_ERROR,
  SET_TAKEN_IMAGE
} from '../../actions/pvs'

const initialState = {
  serialNumber: '',
  serialNumbers: [],
  fetchingSN: false,
  takenImage: null
}

export const pvsReducer = createReducer(
  {
    [SAVE_PVS_SN]: (state, payload) => ({
      serialNumber: payload
    }),

    [GET_SN_INIT]: state => ({
      ...state,
      fetchingSN: true
    }),
    [GET_SN_SUCCESS]: (state, data) => ({
      ...state,
      fetchingSN: false,
      serialNumbers: data
    }),
    [GET_SN_ERROR]: (state, data) => ({
      ...state,
      fetchingSN: false,
      serialNumbers: [],
      error: data
    }),
    [SET_TAKEN_IMAGE]: (state, data) => ({
      ...state,
      takenImage: data
    })
  },
  initialState
)
