import {
  DOWNLOAD_PROGRESS,
  GET_FILE,
  GET_FILE_ERROR,
  SET_FILE_NAME,
  SET_FILES_SIZE
} from 'state/actions/fileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  name: '',
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
    [SET_FILE_NAME]: (state, name) => ({ ...state, name }),
    [SET_FILES_SIZE]: (state, size) => ({ ...state, size }),
    [DOWNLOAD_PROGRESS]: (state, payload) => ({
      ...state,
      error: ''
    }),
    [GET_FILE_ERROR]: (state, { error }) => ({ ...state, error })
  },
  initialState
)
