import {
  GRID_PROFILE_DOWNLOAD_ERROR,
  GRID_PROFILE_DOWNLOAD_INIT,
  GRID_PROFILE_DOWNLOAD_PROGRESS,
  GRID_PROFILE_DOWNLOAD_SUCCESS
} from 'state/actions/gridProfileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  size: 0,
  lastModified: 0,
  error: '',
  progress: 0
}
export default createReducer(
  {
    [GRID_PROFILE_DOWNLOAD_INIT]: state => ({
      ...state,
      size: 0,
      error: ''
    }),
    [GRID_PROFILE_DOWNLOAD_PROGRESS]: (state, progress) => ({
      ...state,
      progress
    }),
    [GRID_PROFILE_DOWNLOAD_SUCCESS]: (state, { lastModified, size }) => ({
      ...state,
      size,
      lastModified,
      progress: 100
    }),
    [GRID_PROFILE_DOWNLOAD_ERROR]: (state, error) => ({
      ...state,
      error,
      lastModified: 0,
      size: 0
    })
  },
  initialState
)
