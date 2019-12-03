import { createAction } from 'redux-act'
import { getApiFirmware } from 'shared/api'

const folder = 'firmware'
export const GET_FILE = createAction('[ FILE MANAGER ] GET FILE')
export const GET_FILE_ERROR = createAction('[ FILE MANAGER ] GET FILE ERROR')

export const DOWNLOAD_FILE = createAction('[ FILE MANAGER ] DOWNLOAD FILE')
export const DOWNLOAD_PROGRESS = createAction(
  '[ FILE MANAGER ] UPDATE DOWNLOAD PROGRESS'
)
export const ABORT_DOWNLOAD = createAction('[ FILE MANAGER ] ABORT DOWNLOAD')
export const DOWNLOAD_SUCCESS = createAction(
  '[ FILE MANAGER ] DOWNLOAD SUCCESS'
)

const downloadFile = (fileUrl, fileName) => dispatch => {
  window.downloader.init({ folder, wifiOnly: true })
  document.addEventListener('DOWNLOADER_downloadSuccess', e =>
    downloadSuccess(e, dispatch)
  )
  document.addEventListener('DOWNLOADER_downloadProgress', e =>
    downloadProgress(e, dispatch)
  )
  window.downloader.get(fileUrl, null, fileName)
  dispatch(DOWNLOAD_FILE({ fileUrl }))
}

function removeEventListeners() {
  window.downloader.abort()
  document.removeEventListener('DOWNLOADER_downloadSuccess', () => {})
  document.removeEventListener('DOWNLOADER_downloadProgress', () => {})
}

export const abortDownload = () => dispatch => {
  window.downloader.abort()
  dispatch({ type: ABORT_DOWNLOAD })
}

function downloadSuccess(event, dispatch) {
  dispatch(DOWNLOAD_SUCCESS(event.data[0]))
  dispatch(getFile())
  removeEventListeners()
}

function downloadProgress(event, dispatch) {
  // event.data[0] is the percentage of the download
  // event.data[1] is the name of the file
  dispatch(
    DOWNLOAD_PROGRESS({ progress: event.data[0], fileName: event.data[1] })
  )
}

async function getFileURLandName() {
  try {
    const swagger = await getApiFirmware()
    const response = await swagger.apis.pvs6.firmwareUpdate({ fwver: 0 })
    const fileURL = response.data
    const fileNameArr = fileURL.split('/').slice(-3)
    const fileName = `${fileNameArr.shift()}-${fileNameArr.pop()}`
    return { fileName, fileURL }
  } catch (e) {
    console.error(e)
  }
}

export function getFile() {
  return async dispatch => {
    const { fileURL, fileName } = (await getFileURLandName()) || {}
    if (!fileURL || !fileName) {
      return dispatch(
        GET_FILE_ERROR({
          error: 'There is an error with the pvs file name or download URL'
        })
      )
    }
    try {
      const file = await readFile(fileName)
      dispatch(GET_FILE({ file }))
      console.warn(file)
    } catch (e) {
      dispatch(downloadFile(fileURL, fileName))
    }
  }
}

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    const type = window.PERSISTENT
    const size = 50 * 1024 * 1024
    const success = fs =>
      fs.root.getFile(
        `${folder}/${fileName}`,
        { create: false },
        fileEntry => fileEntry.file(resolve, reject),
        reject
      )
    window.requestFileSystem(type, size, success, reject)
  })
}
