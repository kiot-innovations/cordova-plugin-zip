import { createReducer } from 'redux-act'

import {
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_PROGRESS,
  PVS_FIRMWARE_DOWNLOAD_SUCCESS,
  PVS_FIRMWARE_DOWNLOAD_ERROR
} from 'state/actions/fileDownloader'

const initialState = {
  progress: 0,
  downloading: false
}
export default createReducer(
  {
    [PVS_FIRMWARE_DOWNLOAD_INIT]: () => initialState,
    [PVS_FIRMWARE_DOWNLOAD_PROGRESS]: (state, { progress }) => ({
      ...state,
      progress,
      downloading: true
    }),
    [PVS_FIRMWARE_DOWNLOAD_SUCCESS]: state => ({
      ...state,
      progress: 100,
      downloading: false
    }),
    [PVS_FIRMWARE_DOWNLOAD_ERROR]: state => ({
      ...state,
      downloading: false
    })
  },
  initialState
)
