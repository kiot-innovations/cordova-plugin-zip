import { createAction } from 'redux-act'
import { getApiFirmware } from 'shared/api'

export const GET_FILE = createAction('[ FILE MANAGER ] GET FILE')
export const GET_FILE_ERROR = createAction('[ FILE MANAGER ] GET FILE ERROR')
export const SET_FILE_NAME = createAction('[ FILE MANAGER ] SET FILE NAME')

export const DOWNLOAD_PROGRESS = createAction(
  '[ FILE MANAGER ] UPDATE DOWNLOAD PROGRESS'
)
export const ABORT_DOWNLOAD = createAction('[ FILE MANAGER ] ABORT DOWNLOAD')
export const DOWNLOAD_SUCCESS = createAction(
  '[ FILE MANAGER ] DOWNLOAD SUCCESS'
)

export const SET_FILES_SIZE = createAction('[ FILE MANAGER ] SET DOWNLOAD SIZE')
const ERROR_CODES = {
  getVersionInfo: 'getVersionInfo',
  getLuaFile: 'getLuaFile',
  noLuaFile: 'noLuaFile',
  noFSFile: 'no filesystem file',
  parseLuaFile: 'parseLuaFile'
}

async function getVersionNumber() {
  try {
    const swagger = await getApiFirmware()
    const response = await swagger.apis.pvs6.firmwareUpdate({ fwver: 0 })
    const fileURL = response.data
    const fileNameArr = fileURL.split('/').slice(-3)
    const version = fileNameArr[0]
    const fileName = fileNameArr.pop()
    const luaFileName = `${version}-${fileName}`
    return { luaFileName, fileURL, version }
  } catch (e) {
    throw new Error(ERROR_CODES.getVersionInfo)
  }
}

async function getPersistentFile(fileName, fileUrl, dispatch) {
  return new Promise((resolve, reject) => {
    const type = window.PERSISTENT
    const size = 5 * 1024 * 1024

    function successCallback(fs) {
      fs.root.getFile(
        `firmware/${fileName}`,
        {},
        function(fileEntry) {
          fileEntry.file(
            file => {
              resolve(file)
            },
            () => {
              reject(new Error(ERROR_CODES.noLuaFile))
            }
          )
        },
        () => {
          downlandLuaFile(fileName, fileUrl, dispatch)
          reject(new Error(ERROR_CODES.getLuaFile))
        }
      )
    }

    window.requestFileSystem(type, size, successCallback, () =>
      reject(new Error(ERROR_CODES.getLuaFile))
    )
  })
}

export function getFile() {
  return async function(dispatch) {
    try {
      const { fileURL, luaFileName, version } = await getVersionNumber()
      dispatch(SET_FILE_NAME(luaFileName))
      await getPersistentFile(luaFileName, fileURL, dispatch)
      const fileSystemURL = await parseLuaFile(luaFileName, dispatch)
      removeEventListeners()
      await getPersistentFile(`${version}-fs.tgz`, fileSystemURL, dispatch)
      dispatch(DOWNLOAD_SUCCESS())
    } catch (error) {
      if (error.message === ERROR_CODES.getVersionInfo) {
        dispatch(
          GET_FILE_ERROR({
            error: 'I ran into an error getting the PVS filename'
          })
        )
      }
    }
  }
}

function parseLuaFile(fileName, dispatch) {
  return new Promise((resolve) => {
    const type = window.PERSISTENT
    const size = 5 * 1024 * 1024
    function successCallback(fs) {
      fs.root.getFile(
        `firmware/${fileName}`,
        {},
        function(fileEntry) {
          fileEntry.file(
            function(file) {
              const reader = new FileReader()
              reader.onloadend = function() {
                const urlRegex = /url\s=\s'\S*/gm
                const sizeRegex = /dlsize\s=\s\S*/gm

                function getStringData(regex, luaFile) {
                  return regex
                    .exec(luaFile)[0]
                    .split("'")
                    .splice(1, 1)
                    .pop()
                }

                function getIntegerData(regex, luaFile) {
                  return parseFloat(
                    regex
                      .exec(luaFile)[0]
                      .split(' = ')
                      .pop()
                      .split(',')
                      .shift()
                  )
                }

                const size = (
                  getIntegerData(sizeRegex, this.result) / 1000000
                ).toFixed(2)
                const fileUrl = getStringData(urlRegex, this.result)
                dispatch(SET_FILES_SIZE(size))
                resolve(fileUrl)
              }
              reader.readAsText(file)
            },
            e => console.error('FILE', e)
          )
        },
        e => console.error('FS', e)
      )
    }

    window.requestFileSystem(type, size, successCallback, console.warn)
  })
}

function downloadProgress(event, dispatch) {
  // event.data[0] is the percentage of the download
  // event.data[1] is the name of the file
  return dispatch(DOWNLOAD_PROGRESS({ progress: event.data[0] }))
}

function downlandLuaFile(fileName, fileUrl, dispatch) {
  window.downloader.init({ folder: 'firmware' })
  document.addEventListener('DOWNLOADER_downloadProgress', e => {
    downloadProgress(e, dispatch)
  })

  document.addEventListener('DOWNLOADER_downloadSuccess', e =>
    downloadSuccess(e, dispatch)
  )
  window.downloader.get(fileUrl, null, fileName)
}

function removeEventListeners() {
  window.downloader.abort()
  document.removeEventListener('DOWNLOADER_downloadSuccess', () => {})
  document.removeEventListener('DOWNLOADER_downloadProgress', () => {})
}

export const abortDownload = () => dispatch => {
  window.downloader.abort()
  dispatch(ABORT_DOWNLOAD() )
}

function downloadSuccess(event, dispatch) {
  removeEventListeners()
  dispatch(getFile())
}
