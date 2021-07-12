import { createReducer } from 'redux-act'

import {
  PVS6_GRID_PROFILE_DOWNLOAD_ERROR,
  PVS6_GRID_PROFILE_DOWNLOAD_INIT,
  PVS6_GRID_PROFILE_DOWNLOAD_PROGRESS,
  PVS6_GRID_PROFILE_DOWNLOAD_SUCCESS
} from 'state/actions/gridProfileDownloader'

const initialState = {
  size: 0,
  lastModified: 0,
  error: '',
  progress: 0
}

export default createReducer(
  {
    [PVS6_GRID_PROFILE_DOWNLOAD_INIT]: state => ({
      ...state,
      size: 0,
      error: ''
    }),
    [PVS6_GRID_PROFILE_DOWNLOAD_PROGRESS]: (state, progress) => ({
      ...state,
      progress
    }),
    [PVS6_GRID_PROFILE_DOWNLOAD_SUCCESS]: (state, { lastModified, size }) => ({
      ...state,
      size,
      lastModified,
      error: '',
      progress: 100
    }),
    [PVS6_GRID_PROFILE_DOWNLOAD_ERROR]: (state, { error }) => ({
      ...state,
      error,
      lastModified: 0,
      size: 0
    })
  },
  initialState
)
