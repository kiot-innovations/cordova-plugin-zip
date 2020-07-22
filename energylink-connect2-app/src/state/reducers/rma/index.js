import { createReducer } from 'redux-act'
import { RMA_SELECT_PVS } from 'state/actions/rma'

const initialState = {
  pvs: null
}

const RMAReducer = createReducer(
  {
    [RMA_SELECT_PVS]: (state, pvs) => ({
      ...state,
      pvs
    })
  },
  initialState
)

export default RMAReducer
