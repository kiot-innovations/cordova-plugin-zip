import { compose, last, split, pathOr } from 'ramda'
import { createAction } from 'redux-act'
import { applyToEventListeners } from 'shared/utils'
export const GRID_PROFILE_DOWNLOAD_INIT = createAction(
  'GRID_PROFILE_DOWNLOAD_INIT'
)
export const GRID_PROFILE_DOWNLOAD_PROGRESS = createAction(
  'GRID_PROFILE_DOWNLOAD_PROGRESS'
)
export const GRID_PROFILE_DOWNLOAD_ERROR = createAction(
  'GRID_PROFILE_DOWNLOAD_ERROR'
)
export const GRID_PROFILE_DOWNLOAD_SUCCESS = createAction(
  'GRID_PROFILE_DOWNLOAD_SUCCESS'
)
export const GRID_PROFILE_GET_FILE = createAction('GRID_PROFILE_GET_FILE')
export const GRID_PROFILE_FILE_ERROR = createAction('GRID_PROFILE_FILE_ERROR')
export const GRID_PROFILE_SET_FILE_INFO = createAction(
  'GRID_PROFILE_SET_FILE_INFO'
)

const eventListeners = {}

const ERROR_CODES = {
  NO_FILESYSTEM_FILE: 'no filesystem file'
}

export const getGridProfileFileName = compose(last, split('/'))

async function downloadSuccess(event, dispatch) {
  removeEventListeners()
  getGridProfileFileInfo()
    .then(fileInfo => dispatch(GRID_PROFILE_DOWNLOAD_SUCCESS(fileInfo)))
    .catch(error => dispatch(GRID_PROFILE_FILE_ERROR({ error: error.message })))
}

function downloadProgress(event, dispatch) {
  return dispatch(
    GRID_PROFILE_DOWNLOAD_PROGRESS({ progress: pathOr(0, ['data', 0], event) })
  )
}

function downloadError(event, dispatch) {
  return dispatch(
    GRID_PROFILE_DOWNLOAD_ERROR({ progress: pathOr(0, ['data', 0], event) })
  )
}

export function downloadFile(
  fileName,
  fileUrl,
  dispatch,
  wifiOnly,
  showProgress = true
) {
  window.downloader.init({ folder: 'firmware' })

  eventListeners['DOWNLOADER_downloadProgress'] = showProgress
    ? e => downloadProgress(e, dispatch)
    : undefined

  eventListeners['DOWNLOADER_downloadSuccess'] = e =>
    downloadSuccess(e, dispatch)

  eventListeners['DOWNLOADER_onDownloadError'] = e =>
    dispatch(downloadError(e, dispatch))

  applyToEventListeners(document.addEventListener, eventListeners)
  window.downloader.get(fileUrl, null, fileName)
}

export const getGridProfileFileInfo = () =>
  new Promise((resolve, reject) => {
    const type = window.PERSISTENT
    const size = 5 * 1024 * 1024
    function successCallback(fs) {
      fs.root.getFile(
        `firmware/${getGridProfileFileName(
          process.env.REACT_APP_GRID_PROFILE_URL
        )}`,
        {},
        function(fileEntry) {
          fileEntry.file(
            file => {
              resolve(file)
            },
            () => reject(new Error(ERROR_CODES.NO_FILESYSTEM_FILE))
          )
        },
        reject
      )
    }
    window.requestFileSystem(type, size, successCallback, () =>
      reject(new Error(ERROR_CODES.NO_FILESYSTEM_FILE))
    )
  })

export const getFileBlob = file =>
  new Promise(async resolve => {
    const reader = new FileReader()
    reader.onloadend = function() {
      resolve(new Blob([this.result]))
    }
    reader.readAsArrayBuffer(file)
  })

export const getFile = (wifiOnly = true) => dispatch => {
  removeEventListeners()
  downloadFile(
    getGridProfileFileName(process.env.REACT_APP_GRID_PROFILE_URL),
    process.env.REACT_APP_GRID_PROFILE_URL,
    dispatch,
    wifiOnly,
    true
  )
}

function removeEventListeners() {
  window.downloader.abort()
  applyToEventListeners(document.removeEventListener, eventListeners)
}

export const abortDownload = () => dispatch => {
  window.downloader.abort()
}

export const setFileInfo = () => dispatch =>
  getGridProfileFileInfo()
    .then(fileInfo => dispatch(GRID_PROFILE_SET_FILE_INFO(fileInfo)))
    .catch(error => dispatch(GRID_PROFILE_FILE_ERROR({ error: error.message })))
