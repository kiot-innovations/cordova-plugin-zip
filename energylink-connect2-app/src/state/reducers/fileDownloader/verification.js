import { createReducer } from 'redux-act'
import {
  FILES_VERIFY,
  FILES_VERIFY_GP_COMPLETED,
  FILES_VERIFY_ESS_COMPLETED,
  FILES_VERIFY_PVS_COMPLETED,
  PVS_FIRMWARE_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_ERROR,
  PVS_DECOMPRESS_LUA_FILES_SUCCESS,
  PVS_DECOMPRESS_LUA_FILES_ERROR
} from 'state/actions/fileDownloader'
import {
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_SUCCESS
} from 'state/actions/ess'
import {
  GRID_PROFILE_DOWNLOAD_ERROR,
  GRID_PROFILE_DOWNLOAD_INIT,
  GRID_PROFILE_DOWNLOAD_SUCCESS
} from 'state/actions/gridProfileDownloader'

const initialState = {
  gpVerified: null,
  pvsVerified: null,
  essVerified: null,
  gpDownloading: false,
  pvsDownloading: false,
  essDownloading: false
}

export default createReducer(
  {
    [FILES_VERIFY]: () => initialState,
    [FILES_VERIFY_GP_COMPLETED]: (state, gpVerified) => ({
      ...state,
      gpVerified
    }),
    [FILES_VERIFY_ESS_COMPLETED]: (state, essVerified) => ({
      ...state,
      essVerified
    }),
    [FILES_VERIFY_PVS_COMPLETED]: (state, pvsVerified) => ({
      ...state,
      pvsVerified
    }),
    [GRID_PROFILE_DOWNLOAD_INIT]: state => ({ ...state, gpDownloading: true }),
    [DOWNLOAD_OS_INIT]: state => ({ ...state, essDownloading: true }),
    [PVS_FIRMWARE_DOWNLOAD_INIT]: state => ({ ...state, pvsDownloading: true }),

    [GRID_PROFILE_DOWNLOAD_ERROR]: state => ({
      ...state,
      gpDownloading: false
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
    [GRID_PROFILE_DOWNLOAD_SUCCESS]: state => ({
      ...state,
      gpDownloading: false
    }),
    [DOWNLOAD_OS_SUCCESS]: state => ({ ...state, essDownloading: false }),
    [PVS_DECOMPRESS_LUA_FILES_SUCCESS]: state => ({
      ...state,
      pvsDownloading: false
    })
  },
  initialState
)
