import {
  GRID_PROFILE_DOWNLOAD_INIT,
  GRID_PROFILE_DOWNLOAD_PROGRESS,
  GRID_PROFILE_DOWNLOAD_SUCCESS,
  GRID_PROFILE_GET_FILE,
  GRID_PROFILE_FILE_ERROR,
  GRID_PROFILE_SET_FILE_INFO
} from 'state/actions/gridProfileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  progress: 100,
  lastProgress: 0,
  error: '',
  lastModified: null
}
export default createReducer(
  {
    [GRID_PROFILE_DOWNLOAD_SUCCESS]: (state, { lastModified }) => ({
      ...state,
      lastModified,
      progress: 100,
      lastProgress: 100
    }),
    [GRID_PROFILE_DOWNLOAD_PROGRESS]: (state, payload) => ({
      ...state,
      progress: payload.progress,
      lastProgress: state.progress
    }),
    [GRID_PROFILE_GET_FILE]: state => ({
      ...state,
      progress: 100,
      lastProgress: 0
    }),
    [GRID_PROFILE_DOWNLOAD_INIT]: state => ({
      ...state,
      progress: 0,
      lastProgress: 0
    }),
    [GRID_PROFILE_FILE_ERROR]: (state, { error }) => ({ ...state, error }),
    [GRID_PROFILE_SET_FILE_INFO]: (state, { lastModified }) => ({
      ...state,
      lastModified
    })
  },
  initialState
)
