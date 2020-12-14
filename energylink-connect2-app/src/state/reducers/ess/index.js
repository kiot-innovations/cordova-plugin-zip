import { createReducer } from 'redux-act'
import {
  DOWNLOAD_OS_ERROR,
  DOWNLOAD_OS_INIT,
  DOWNLOAD_OS_PROGRESS,
  DOWNLOAD_OS_REPORT_SUCCESS,
  DOWNLOAD_OS_SUCCESS,
  DOWNLOAD_OS_UPDATE_VERSION
} from 'state/actions/ess'
import { assoc } from 'ramda'

const initialState = {
  progress: 0,
  error: null,
  file: null,
  meta: null,
  total: 0,
  isDownloading: false,
  md5: '',
  step: '',
  version: undefined,
  lastModified: 0
}

export default createReducer(
  {
    [DOWNLOAD_OS_INIT]: state => ({
      ...initialState,
      meta: state.meta,
      md5: state.md5,
      step: 'INITIALIZING'
    }),
    [DOWNLOAD_OS_PROGRESS]: (state, { progress, total, step }) => ({
      ...state,
      progress,
      total: total ? (total / 1000000).toFixed(2) : state.total,
      error: null,
      step,
      isDownloading: true
    }),
    [DOWNLOAD_OS_ERROR]: (state, error) => ({
      ...state,
      error,
      isDownloading: false
    }),
    [DOWNLOAD_OS_SUCCESS]: (state, { entryFile, total, lastModified }) => ({
      ...state,
      lastModified,
      file: entryFile,
      error: null,
      isDownloading: false,
      total: total ? (total / 1000000).toFixed(2) : state.total,
      step: ''
    }),
    [DOWNLOAD_OS_REPORT_SUCCESS]: (state, { serverHeaders = {} }) => {
      if (serverHeaders['x-amz-meta-md5-hash']) {
        return assoc('md5', serverHeaders['x-amz-meta-md5-hash'], state)
      } else if (serverHeaders['x-checksum-md5']) {
        return assoc('md5', serverHeaders['x-checksum-md5'], state)
      }
      return state
    },
    [DOWNLOAD_OS_UPDATE_VERSION]: (state, version) => ({
      ...state,
      version
    })
  },
  initialState
)
