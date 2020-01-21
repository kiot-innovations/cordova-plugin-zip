import { createReducer } from 'redux-act'
import {
  CONVERT_BASE64_INIT,
  CONVERT_BASE64_SUCCESS
} from '../../actions/share'

const initialState = {
  isConverting: false,
  dataUrl: ''
}

export const shareReducer = createReducer(
  {
    [CONVERT_BASE64_INIT]: state => ({
      ...state,
      isConverting: true,
      dataUrl: ''
    }),
    [CONVERT_BASE64_SUCCESS]: (state, payload) => ({
      ...state,
      isConverting: false,
      dataUrl: payload
    })
  },
  initialState
)
