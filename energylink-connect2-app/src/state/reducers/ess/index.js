import { createReducer } from 'redux-act'
import {
  DOWNLOAD_META_ERROR,
  DOWNLOAD_META_INIT,
  DOWNLOAD_META_SUCCESS,
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_PROGRESS,
  DOWNLOAD_OS_SUCCESS
} from 'state/actions/ess'

const initialState = {
  progress: 0,
  error: null,
  file: null,
  meta: null,
  isDownloading: false
}

export default createReducer(
  {
    [DOWNLOAD_OS_INIT]: state => ({
      ...initialState,
      ...state,
      isDownloading: true
    }),
    [DOWNLOAD_OS_PROGRESS]: (state, progress) => ({
      ...state,
      progress,
      isDownloading: true
    }),
    [DOWNLOAD_OS_ERROR]: (state, error) => ({
      ...state,
      error,
      isDownloading: false
    }),
    [DOWNLOAD_META_ERROR]: (state, error) => ({
      ...state,
      error
    }),
    [DOWNLOAD_OS_SUCCESS]: (state, entryFile) => ({
      ...state,
      file: entryFile,
      isDownloading: false
    }),
    [DOWNLOAD_META_INIT]: state => ({
      ...initialState,
      ...state
    }),
    [DOWNLOAD_META_SUCCESS]: (state, meta) => ({
      ...state,
      meta
    })
  },
  initialState
)
