import { createReducer } from 'redux-act'

import {
  PVS5_GRID_PROFILE_DOWNLOAD_ERROR,
  PVS5_GRID_PROFILE_DOWNLOAD_INIT,
  PVS5_GRID_PROFILE_DOWNLOAD_PROGRESS,
  PVS5_GRID_PROFILE_DOWNLOAD_SUCCESS
} from 'state/actions/gridProfileDownloader'

const initialState = {
  size: 0,
  lastModified: 0,
  error: '',
  progress: 0
}

export default createReducer(
  {
    [PVS5_GRID_PROFILE_DOWNLOAD_INIT]: state => ({
      ...state,
      size: 0,
      error: ''
    }),
    [PVS5_GRID_PROFILE_DOWNLOAD_PROGRESS]: (state, progress) => ({
      ...state,
      progress
    }),
    [PVS5_GRID_PROFILE_DOWNLOAD_SUCCESS]: (state, { lastModified, size }) => ({
      ...state,
      size,
      lastModified,
      error: '',
      progress: 100
    }),
    [PVS5_GRID_PROFILE_DOWNLOAD_ERROR]: (state, { error }) => ({
      ...state,
      error,
      lastModified: 0,
      size: 0
    })
  },
  initialState
)
