import {
  DOWNLOAD_NO_WIFI,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_INIT,
  DOWNLOAD_ERROR,
  DOWNLOAD_FINISHED
} from 'state/actions/fileDownloader'
import { createReducer } from 'redux-act'

const initialState = {
  progress: 0,
  lastProgress: 0,
  fileName: '',
  downloading: false
}
export default createReducer(
  {
    [DOWNLOAD_INIT]: (state, { fileUrl, fileName }) => ({
      ...state,
      fileUrl,
      fileName,
      downloading: true,
      progress: 0,
      lastProgress: 0
    }),
    [DOWNLOAD_PROGRESS]: (state, { progress }) => ({
      ...state,
      progress,
      downloading: true,
      lastProgress: state.progress
    }),
    [DOWNLOAD_FINISHED]: state => ({
      ...state,
      downloading: false
    }),
    [DOWNLOAD_SUCCESS]: state => ({
      ...state,
      progress: 100,
      lastProgress: state.progress,
      downloading: false
    }),
    [DOWNLOAD_ERROR]: state => ({
      ...state,
      downloading: false
    }),
    [DOWNLOAD_NO_WIFI]: state => ({
      ...state,
      progress: 0,
      lastProgress: 0,
      downloading: false,
      filePath: ''
    })
  },
  initialState
)
