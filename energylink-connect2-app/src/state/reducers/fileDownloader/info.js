import {
  DOWNLOAD_PROGRESS,
  GET_FILE,
  GET_FILE_ERROR
} from '../../actions/fileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  name: 'PVS6 FW 3.1',
  size: 0,
  error: ''
}

export default createReducer(
  {
    [GET_FILE]: (state, payload) => ({
      ...state,
      size: (payload.size / 1000000).toFixed(2),
      error: ''
    }),
    [DOWNLOAD_PROGRESS]: (state, payload) => ({
      ...state,
      name: payload.fileName,
      error: ''
    }),
    [GET_FILE_ERROR]: (state, { error }) => ({ ...state, error })
  },
  initialState
)
