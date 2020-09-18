import { createReducer } from 'redux-act'
import {
  DOWNLOAD_META_ERROR,
  DOWNLOAD_META_INIT,
  DOWNLOAD_META_SUCCESS,
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_PROGRESS,
  DOWNLOAD_OS_REPORT_SUCCESS,
  DOWNLOAD_OS_SUCCESS
} from 'state/actions/ess'
import { assoc, path } from 'ramda'

const initialState = {
  progress: 0,
  error: null,
  file: null,
  meta: null,
  total: 0,
  isDownloading: false,
  md5: '',
  step: ''
}

export default createReducer(
  {
    [DOWNLOAD_OS_INIT]: state => ({
      ...initialState,
      meta: state.meta,
      md5: state.md5,
      isDownloading: true,
      step: 'INITIALIZING'
    }),
    [DOWNLOAD_OS_PROGRESS]: (state, { progress, total, step }) => ({
      ...state,
      progress,
      total,
      error: null,
      step,
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
      error: null,
      isDownloading: false,
      step: ''
    }),
    [DOWNLOAD_META_INIT]: state => ({
      ...initialState,
      ...state
    }),
    [DOWNLOAD_META_SUCCESS]: (state, meta) => ({
      ...state,
      meta
    }),
    [DOWNLOAD_OS_REPORT_SUCCESS]: (state, payload) => {
      const md5 = path(['serverHeaders', 'x-checksum-md5'], payload)
      if (md5) return assoc('md5', md5, state)
      return state
    }
  },
  initialState
)
