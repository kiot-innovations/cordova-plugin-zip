import {
  DOWNLOAD_NO_WIFI,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_SUCCESS,
  GET_FILE,
  GET_FILE_ERROR,
  SET_FILE_INFO,
  SET_FILE_SIZE
} from 'state/actions/fileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  name: '',
  displayName: '',
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
    [SET_FILE_INFO]: (state, { name, displayName }) => ({
      ...state,
      name,
      displayName
    }),
    [SET_FILE_SIZE]: (state, size) => ({ ...state, size }),
    [DOWNLOAD_PROGRESS]: state => ({
      ...state,
      error: ''
    }),
    [DOWNLOAD_SUCCESS]: state => ({ ...state, error: '' }),
    [GET_FILE_ERROR]: (state, { error }) => ({ ...state, error }),
    [DOWNLOAD_NO_WIFI]: state => ({ ...state, error: 'NO WIFI' })
  },
  initialState
)
