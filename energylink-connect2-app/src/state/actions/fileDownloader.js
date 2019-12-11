import { createAction } from 'redux-act'

export const GET_FILE = createAction('[ FILE MANAGER ] GET FILE')
export const GET_LUA_FILE = createAction('[ FILE MANAGER ] GET LUA FILE')
export const GET_FILE_ERROR = createAction('[ FILE MANAGER ] GET FILE ERROR')

export const DOWNLOAD_FILE = createAction('[ FILE MANAGER ] DOWNLOAD FILE')
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
    // const swagger = await getApiFirmware()
    // const response = await swagger.apis.pvs6.firmwareUpdate({ fwver: 0 })
    const fileURL =
      'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-adama/249/fwup/fwup.lua'
    const fileNameArr = fileURL.split('/').slice(-3)
    const fileName = `${fileNameArr.shift()}-${fileNameArr.pop()}`
    return { fileName, fileURL }
  } catch (e) {
    throw new Error(ERROR_CODES.getVersionInfo)
  }
}

async function getLuaFile(fileName, fileUrl, dispatch) {
  return new Promise((resolve, reject) => {
    console.log('get lua file',fileName)
    const type = window.PERSISTENT
    const size = 5 * 1024 * 1024

    function successCallback(fs) {
      fs.root.getFile(
        `firmware/${fileName}`,
        {},
        function(fileEntry) {
          fileEntry.file(
            file => {
              console.log(file)
              resolve(file)
            },
            () => {
              downlandLuaFile(fileName, fileUrl, dispatch)
              reject(new Error(ERROR_CODES.noLuaFile))
            }
          )
        },
        () => reject(new Error(ERROR_CODES.getLuaFile))
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
      const { fileURL, fileName } = await getVersionNumber()
      console.log({ fileURL, fileName })
      const luaFile = await getLuaFile(fileName, fileURL, dispatch)
      console.log(luaFile)
    } catch (error) {
      console.log('I ran into an error', error)
      switch (error.message) {
        case ERROR_CODES.getVersionInfo:
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
  return new Promise((resolve, reject) => {
    console.log('PARSING LUA FILE')
    debugger
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
              reader.onloadend = function(e) {
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
                debugger
                resolve(fileUrl)
                dispatch(SET_FILES_SIZE({ size }))
                downlandFsRootFile(fileUrl)
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

async function downlandFsRootFile() {}

function downloadProgress(event, dispatch) {
  // event.data[0] is the percentage of the download
  // event.data[1] is the name of the file
  return dispatch(
    DOWNLOAD_PROGRESS({ progress: event.data[0], fileName: event.data[1] })
  )
}

function downlandLuaFile(fileName, fileUrl, dispatch) {
  window.downloader.init({ folder: 'firmware', wifiOnly: true })
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
  dispatch({ type: ABORT_DOWNLOAD })
}

function downloadSuccess(event, dispatch) {
  dispatch(DOWNLOAD_SUCCESS(event.data[0]))
  dispatch(getFile())
  removeEventListeners()
}
