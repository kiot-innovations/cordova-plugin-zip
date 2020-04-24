import { last, split } from 'ramda'
import { createAction } from 'redux-act'
export const GRID_PROFILE_DOWNLOAD_INIT = createAction(
  'GRID_PROFILE_DOWNLOAD_INIT'
)
export const GRID_PROFILE_DOWNLOAD_PROGRESS = createAction(
  'GRID_PROFILE_DOWNLOAD_PROGRESS'
)
export const GRID_PROFILE_DOWNLOAD_SUCCESS = createAction(
  'GRID_PROFILE_DOWNLOAD_SUCCESS'
)
export const GRID_PROFILE_GET_FILE = createAction('GRID_PROFILE_GET_FILE')
export const GRID_PROFILE_FILE_ERROR = createAction('GRID_PROFILE_FILE_ERROR')
export const GRID_PROFILE_SET_FILE_INFO = createAction(
  'GRID_PROFILE_SET_FILE_INFO'
)

const GRID_PROFILE_URL =
  'https://s3-us-west-2.amazonaws.com/2oduso0/gridprofiles/v2/gridprofiles.tar.gz'

const ERROR_CODES = {
  noFSFile: 'no filesystem file'
}

export const getGridProfileFileName = () => last(split('/')(GRID_PROFILE_URL))

async function downloadSuccess(event, dispatch, wifiOnly) {
  removeEventListeners()
  dispatch(GRID_PROFILE_DOWNLOAD_SUCCESS(await getGridProfileFileInfo()))
}

function downloadProgress(event, dispatch) {
  return dispatch(GRID_PROFILE_DOWNLOAD_PROGRESS({ progress: event.data[0] }))
}

function downloadFile(
  fileName,
  fileUrl,
  dispatch,
  wifiOnly,
  showProgress = true
) {
  window.downloader.init({ folder: 'firmware' })

  if (showProgress)
    document.addEventListener('DOWNLOADER_downloadProgress', e => {
      downloadProgress(e, dispatch)
    })

  document.addEventListener('DOWNLOADER_downloadSuccess', e =>
    downloadSuccess(e, dispatch, wifiOnly)
  )
  window.downloader.get(fileUrl, null, fileName)
}

export function getGridProfileFileInfo() {
  return new Promise((resolve, reject) => {
    const type = window.PERSISTENT
    const size = 5 * 1024 * 1024
    function successCallback(fs) {
      fs.root.getFile(
        `firmware/${getGridProfileFileName()}`,
        {},
        function(fileEntry) {
          fileEntry.file(
            file => {
              resolve(file)
            },
            () => reject(new Error(ERROR_CODES.noFSFile))
          )
        },
        reject
      )
    }
    window.requestFileSystem(type, size, successCallback, () =>
      reject(new Error(ERROR_CODES.noFSFile))
    )
  })
}

export const getFileBlob = file =>
  new Promise(async resolve => {
    const reader = new FileReader()
    reader.onloadend = function() {
      resolve(new Blob([this.result]))
    }
    reader.readAsArrayBuffer(file)
  })

export function getGridProfileFile(wifiOnly = true) {
  return async function(dispatch) {
    try {
      removeEventListeners()
      await downloadFile(
        getGridProfileFileName(),
        GRID_PROFILE_URL,
        dispatch,
        wifiOnly,
        true
      )
      GRID_PROFILE_SET_FILE_INFO(await getGridProfileFileInfo())
    } catch (error) {
      dispatch(GRID_PROFILE_FILE_ERROR({ error: error.message }))
    }
  }
}

function removeEventListeners() {
  window.downloader.abort()
  document.removeEventListener('DOWNLOADER_downloadSuccess', () => {})
  document.removeEventListener('DOWNLOADER_downloadProgress', () => {})
}

export const abortDownload = () => dispatch => {
  window.downloader.abort()
}

export const setFileInfo = () => {
  return async function(dispatch) {
    dispatch(GRID_PROFILE_SET_FILE_INFO(await getGridProfileFileInfo()))
  }
}
