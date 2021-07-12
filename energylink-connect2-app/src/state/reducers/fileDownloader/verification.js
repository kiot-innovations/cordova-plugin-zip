import { createReducer } from 'redux-act'

import {
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_SUCCESS
} from 'state/actions/ess'
import {
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_ERROR,
  PVS_DECOMPRESS_LUA_FILES_SUCCESS,
  PVS_DECOMPRESS_LUA_FILES_ERROR
} from 'state/actions/fileDownloader'
import {
  PVS6_GRID_PROFILE_DOWNLOAD_INIT,
  PVS6_GRID_PROFILE_DOWNLOAD_SUCCESS,
  PVS6_GRID_PROFILE_DOWNLOAD_ERROR,
  PVS5_GRID_PROFILE_DOWNLOAD_INIT,
  PVS5_GRID_PROFILE_DOWNLOAD_SUCCESS,
  PVS5_GRID_PROFILE_DOWNLOAD_ERROR
} from 'state/actions/gridProfileDownloader'

const initialState = {
  pvs6GpDownloading: false,
  pvs5GpDownloading: false,
  pvsDownloading: false,
  essDownloading: false
}

export default createReducer(
  {
    [PVS6_GRID_PROFILE_DOWNLOAD_INIT]: state => ({
      ...state,
      pvs6GpDownloading: true
    }),
    [PVS5_GRID_PROFILE_DOWNLOAD_INIT]: state => ({
      ...state,
      pvs5GpDownloading: true
    }),
    [DOWNLOAD_OS_INIT]: state => ({ ...state, essDownloading: true }),
    [PVS_FIRMWARE_DOWNLOAD_INIT]: state => ({ ...state, pvsDownloading: true }),

    [PVS6_GRID_PROFILE_DOWNLOAD_ERROR]: state => ({
      ...state,
      pvs6GpDownloading: false
    }),
    [PVS5_GRID_PROFILE_DOWNLOAD_ERROR]: state => ({
      ...state,
      pvs5GpDownloading: false
    }),
    [DOWNLOAD_OS_ERROR]: state => ({ ...state, essDownloading: false }),
    [PVS_FIRMWARE_DOWNLOAD_ERROR]: state => ({
      ...state,
      pvsDownloading: false
    }),
    [PVS_DECOMPRESS_LUA_FILES_ERROR]: state => ({
      ...state,
      pvsDownloading: false
    }),
    [PVS6_GRID_PROFILE_DOWNLOAD_SUCCESS]: state => ({
      ...state,
      pvs6GpDownloading: false
    }),
    [PVS5_GRID_PROFILE_DOWNLOAD_SUCCESS]: state => ({
      ...state,
      pvs5GpDownloading: false
    }),
    [DOWNLOAD_OS_SUCCESS]: state => ({ ...state, essDownloading: false }),
    [PVS_DECOMPRESS_LUA_FILES_SUCCESS]: state => ({
      ...state,
      pvsDownloading: false
    })
  },
  initialState
)
