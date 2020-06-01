import {
  GRID_PROFILE_DOWNLOAD_INIT,
  GRID_PROFILE_FILE_ERROR,
  GRID_PROFILE_SET_FILE_INFO
} from 'state/actions/gridProfileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  size: 0,
  lastModified: 0,
  error: ''
}
export default createReducer(
  {
    [GRID_PROFILE_DOWNLOAD_INIT]: state => ({
      ...state,
      size: 0,
      error: ''
    }),
    [GRID_PROFILE_SET_FILE_INFO]: (state, { lastModified, size }) => ({
      ...state,
      size,
      lastModified,
      error: ''
    }),
    [GRID_PROFILE_FILE_ERROR]: (state, { error }) => ({
      ...state,
      error,
      lastModified: 0,
      size: 0
    })
  },
  initialState
)
