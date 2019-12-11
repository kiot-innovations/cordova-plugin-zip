import {
  DOWNLOAD_PROGRESS,
  DOWNLOAD_SUCCESS,
  GET_FILE
} from 'state/actions/fileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  progress: 0,
  lastProgress: 0
}
export default createReducer(
  {
    [DOWNLOAD_PROGRESS]: (state, payload) => ({
      progress: payload.progress,
      lastProgress: state.progress
    }),
    [DOWNLOAD_SUCCESS]: (state, payload) => ({
      progress: 100,
      lastProgress: 0
    }),
    [GET_FILE]: (state, payload) => ({ progress: 100, lastProgress: 0 })
  },
  initialState
)
