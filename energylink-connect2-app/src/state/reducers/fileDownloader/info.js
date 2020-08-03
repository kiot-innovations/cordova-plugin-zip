import { propOr } from 'ramda'
import {
  DOWNLOAD_NO_WIFI,
  DOWNLOAD_PROGRESS,
  FIRMWARE_DOWNLOAD_INIT,
  FIRMWARE_DOWNLOADED,
  FIRMWARE_GET_FILE,
  GET_FIRMWARE_URL_SUCCESS,
  SET_FILE_INFO,
  SET_FILE_SIZE
} from 'state/actions/fileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  name: '',
  displayName: '',
  size: 0,
  error: '',
  exists: false,
  updateURL: process.env.REACT_APP_FIRMWARE_URL
}

export default createReducer(
  {
    [GET_FIRMWARE_URL_SUCCESS]: (state, updateURL) => ({
      ...state,
      updateURL
    }),
    [FIRMWARE_GET_FILE]: state => ({
      ...state,
      error: '',
      exists: false
    }),
    [FIRMWARE_DOWNLOAD_INIT]: state => ({
      ...state,
      error: '',
      exists: false
    }),
    [SET_FILE_INFO]: (state, props) => ({
      ...state,
      name: propOr(state.name, 'name', props),
      displayName: propOr(state.displayName, 'displayName', props),
      exists: propOr(state.exists, 'exists', props)
    }),
    [SET_FILE_SIZE]: (state, size) => ({ ...state, size }),
    [DOWNLOAD_PROGRESS]: state => ({
      ...state,
      error: ''
    }),
    [FIRMWARE_DOWNLOADED]: state => ({ ...state, error: '', exists: true }),
    [DOWNLOAD_NO_WIFI]: state => ({ ...state, error: 'NO WIFI' })
  },
  initialState
)
