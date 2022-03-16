import { createReducer } from 'redux-act'

import {
  PVS5_FW_DOWNLOAD_ERROR,
  PVS5_FW_DOWNLOAD_PROGRESS,
  PVS5_FW_DOWNLOAD_SUCCESS,
  PVS5_FW_VERIFY_DOWNLOAD,
  PVS5_SET_FW_INFO,
  PVS5_FW_DOWNLOAD_RESTART
} from 'state/actions/fileDownloader'

const initialState = {
  status: 'idle',
  size: 0,
  lastModified: 0,
  error: '',
  progress: 0,
  name: '',
  updateURL: '',
  version: undefined,
  step: ''
}
export default createReducer(
  {
    [PVS5_SET_FW_INFO]: (
      state,
      { versionName, buildNumber, updateURL, shouldRetry }
    ) => {
      const { status } = state
      const needToDownloadFileSystem =
        status === 'idle' ||
        status === 'error' ||
        (status === 'downloaded' && shouldRetry)

      if (needToDownloadFileSystem) {
        return {
          ...state,
          name: versionName,
          updateURL,
          version: buildNumber,
          status: 'downloading',
          step: 'DOWNLOADING'
        }
      }

      return state
    },

    [PVS5_FW_DOWNLOAD_RESTART]: (
      state,
      { versionName, buildNumber, updateURL, shouldRetry }
    ) => {
      const { status } = state
      const needToDownloadFileSystem =
        status === 'idle' ||
        status === 'error' ||
        (status === 'downloaded' && shouldRetry)

      if (needToDownloadFileSystem) {
        return {
          ...state,
          name: versionName,
          updateURL,
          version: buildNumber,
          status: 'downloading',
          step: 'DOWNLOADING'
        }
      }

      return state
    },

    [PVS5_FW_DOWNLOAD_PROGRESS]: (state, { progress, size, step }) => {
      if (state.status === 'downloading')
        return { ...state, size, step, progress }
      return state
    },

    [PVS5_FW_VERIFY_DOWNLOAD]: (state, payload) => {
      if (state.status === 'downloading')
        return { ...state, status: 'verifying' }
      return state
    },

    [PVS5_FW_DOWNLOAD_SUCCESS]: (state, { lastModified, size }) => {
      if (state.status === 'verifying')
        return { ...state, status: 'downloaded', lastModified, size }
      return state
    },

    [PVS5_FW_DOWNLOAD_ERROR]: (state, error) => ({
      ...state,
      error,
      status: 'error'
    })
  },
  initialState
)
