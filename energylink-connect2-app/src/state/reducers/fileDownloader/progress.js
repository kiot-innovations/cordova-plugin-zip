import {
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_PROGRESS,
  PVS_FIRMWARE_DOWNLOAD_SUCCESS
} from 'state/actions/fileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  progress: 0,
  downloading: false
}
export default createReducer(
  {
    [PVS_FIRMWARE_DOWNLOAD_INIT]: state => ({ ...state, downloading: true }),
    [PVS_FIRMWARE_DOWNLOAD_PROGRESS]: (state, { progress }) => ({
      ...state,
      progress,
      downloading: true
    }),
    [PVS_FIRMWARE_DOWNLOAD_SUCCESS]: state => ({
      ...state,
      progress: 100,
      downloading: false
    })
  },
  initialState
)
