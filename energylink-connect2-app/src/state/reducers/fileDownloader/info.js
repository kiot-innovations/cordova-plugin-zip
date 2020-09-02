import { propOr } from 'ramda'
import {
  PVS_FIRMWARE_DOWNLOAD_ERROR,
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_PROGRESS,
  PVS_FIRMWARE_DOWNLOAD_SUCCESS,
  PVS_FIRMWARE_UPDATE_URL,
  PVS_SET_FILE_INFO
} from 'state/actions/fileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  name: '',
  displayName: '',
  size: 0,
  error: '',
  exists: false,
  updateURL: process.env.REACT_APP_FIRMWARE_URL,
  step: ''
}

export default createReducer(
  {
    [PVS_FIRMWARE_UPDATE_URL]: (state, { url }) => ({
      ...state,
      updateURL: url,
      step: 'UPDATING_URL'
    }),
    [PVS_FIRMWARE_DOWNLOAD_ERROR]: state => ({
      ...state,
      error: 'Error downloading PVS'
    }),
    [PVS_FIRMWARE_DOWNLOAD_INIT]: state => ({
      ...state,
      error: '',
      exists: false,
      step: 'INITIALIZING'
    }),
    [PVS_FIRMWARE_DOWNLOAD_SUCCESS]: (state, { lastModified, size }) => ({
      ...state,
      lastModified,
      size,
      exists: true,
      error: ''
    }),
    [PVS_FIRMWARE_DOWNLOAD_PROGRESS]: (state, { size, step }) => ({
      ...state,
      size: isNaN(size) ? state.size : size,
      error: '',
      step
    }),
    [PVS_SET_FILE_INFO]: (state, props) => ({
      ...state,
      name: propOr(state.name, 'name', props),
      displayName: propOr(state.displayName, 'displayName', props),
      exists: propOr(state.exists, 'exists', props),
      size: propOr(state.size, 'size', props)
    })
  },
  initialState
)
