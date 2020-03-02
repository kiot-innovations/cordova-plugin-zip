import { append, compose, head, join, slice, split } from 'ramda'
import { createAction } from 'redux-act'

export const GET_FILE = createAction('GET FILE')
export const GET_FILE_ERROR = createAction('GET FILE ERROR')
export const SET_FILE_NAME = createAction('SET FILE NAME')

export const DOWNLOAD_PROGRESS = createAction('UPDATE DOWNLOAD PROGRESS')
export const ABORT_DOWNLOAD = createAction('ABORT DOWNLOAD')
export const DOWNLOAD_SUCCESS = createAction('DOWNLOAD SUCCESS')

export const SET_FILES_SIZE = createAction('SET DOWNLOAD SIZE')
const ERROR_CODES = {
  getVersionInfo: 'getVersionInfo',
  getLuaFile: 'getLuaFile',
  noLuaFile: 'noLuaFile',
  noFSFile: 'no filesystem file',
  parseLuaFile: 'parseLuaFile'
}

export const getLuaName = compose(
  join(' '),
  split('-'),
  head,
  slice(-4, -3),
  split('/')
)
const getBuildNumber = compose(
  Number,
  join(' '),
  split('-'),
  head,
  slice(-3, -2),
  split('/')
)
const getFileSystemURL = compose(
  join('/'),
  append('fwup_lua_usb.zip'),
  slice(0, -2),
  split('/')
)
export async function getFirmwareVersionNumber() {
  try {
    // const swagger = await getApiFirmware()
    // const response = await swagger.apis.pvs6.firmwareUpdate({ fwver: 0 })
    const fileURL =
      'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-boomer/7047/fwup/fwup.lua'
    const luaFileName = getLuaName(fileURL)
    return { luaFileName, fileURL, version: getBuildNumber(fileURL) }
  } catch (e) {
    throw new Error(ERROR_CODES.getVersionInfo)
  }
}
export const getFileBlob = (fileName = '') =>
  new Promise(async resolve => {
    const file = await getPFile(fileName)
    const reader = new FileReader()
    reader.onloadend = function() {
      resolve(new Blob([this.result]))
    }
    reader.readAsArrayBuffer(file)
  })

export async function getPFile(fileName, errorCallback) {
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
        errorCallback
      )
    }
    window.requestFileSystem(type, size, successCallback, () =>
      reject(new Error(ERROR_CODES.getLuaFile))
    )
  })
}
async function getPersistentFile(fileName, fileUrl, dispatch) {
  return new Promise((resolve, reject) => {
    const errorCallback = () => {
      downloadLuaFile(fileName, fileUrl, dispatch)
      reject(new Error(ERROR_CODES.getLuaFile))
    }
    getPFile(fileName, errorCallback)
      .then(resolve)
      .catch(reject)
  })
}

export function getFile() {
  return async function(dispatch) {
    try {
      const { fileURL, luaFileName } = await getFirmwareVersionNumber()
      dispatch(SET_FILE_NAME(luaFileName))
      await getPersistentFile(luaFileName, fileURL, dispatch)
      await parseLuaFile(luaFileName, dispatch)
      const fileSystemURL = getFileSystemURL(fileURL)
      removeEventListeners()
      await getPersistentFile(`${luaFileName}.fs`, fileSystemURL, dispatch)
      dispatch(DOWNLOAD_SUCCESS())
    } catch (error) {
      if (error.message === ERROR_CODES.getVersionInfo) {
        dispatch(
          GET_FILE_ERROR({
            error: 'I ran into an error getting the PVS filename'
          })
        )
      } else dispatch(GET_FILE_ERROR({ error: error.message }))
    }
  }
}

function parseLuaFile(fileName, dispatch) {
  return new Promise(resolve => {
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

function downloadLuaFile(fileName, fileUrl, dispatch) {
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
  dispatch(ABORT_DOWNLOAD())
}

function downloadSuccess(event, dispatch) {
  removeEventListeners()
  dispatch(getFile())
}
