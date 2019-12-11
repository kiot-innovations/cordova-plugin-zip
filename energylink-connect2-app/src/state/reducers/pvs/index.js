import { createReducer } from 'redux-act'

import { SAVE_PVS_SN } from '../../actions/pvs'

const initialState = {
  serialNumber: ''
}

export const pvsReducer = createReducer(
  {
    [SAVE_PVS_SN]: (state, payload) => ({
      serialNumber: payload
    })
  },
  initialState
)
