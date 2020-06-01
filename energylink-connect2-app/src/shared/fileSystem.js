import { compose, head, join, last, slice, split } from 'ramda'

export const ERROR_CODES = {
  NO_FILESYSTEM_FILE: 'no filesystem file',
  getVersionInfo: 'getVersionInfo',
  getLuaFile: 'getLuaFile',
  noLuaFile: 'noLuaFile',
  parseLuaFile: 'parseLuaFile',
  noWifi: 'No wifi'
}

export const getFileInfo = path =>
  new Promise((resolve, reject) => {
    const type = window.PERSISTENT
    const size = 5 * 1024 * 1024
    function successCallback(fs) {
      fs.root.getFile(
        path,
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
    window.requestFileSystem(type, size, successCallback, () => {
      reject(new Error(ERROR_CODES.NO_FILESYSTEM_FILE))
    })
  })

export const getFileNameFromURL = compose(last, split('/'))

export const getGridProfileFileName = () =>
  getFileNameFromURL(process.env.REACT_APP_GRID_PROFILE_URL || '')

export const getGridProfileFilePath = () =>
  `firmware/${getGridProfileFileName()}`

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

export const parseLuaFile = fileName =>
  new Promise((resolve, reject) => {
    const type = window.PERSISTENT
    const size = 5 * 1024 * 1024

    function successCallback(fs) {
      fs.root.getFile(
        `firmware/${fileName}`,
        {},
        function(fileEntry) {
          fileEntry.file(function(file) {
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
              resolve({ fileUrl, size })
            }
            reader.readAsText(file)
          }, reject)
        },
        reject
      )
    }

    window.requestFileSystem(type, size, successCallback, reject)
  })

export const getFileBlob = (fileName = '') =>
  new Promise(async resolve => {
    const file = await getFileInfo(fileName)
    const reader = new FileReader()
    reader.onloadend = function() {
      resolve(new Blob([this.result]))
    }
    reader.readAsArrayBuffer(file)
  })

export const getFirmwareVersionData = async () => {
  try {
    // const swagger = await getApiFirmware()
    // const response = await swagger.apis.pvs6.firmwareUpdate({ fwver: 0 })
    const fileURL =
      'https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-boomer/7139/fwup/fwup.lua'
    const luaFileName = getLuaName(fileURL)
    const version = getBuildNumber(fileURL)
    const name = `${luaFileName}-${version}`.replace(/ /g, '-')
    return {
      luaFileName,
      fileURL,
      version,
      pvsFileSystemName: `${name}.fs`,
      luaDownloadName: `${name}.lua`
    }
  } catch (e) {
    throw new Error(ERROR_CODES.getVersionInfo)
  }
}

export const getLuaZipFileURL = version =>
  `https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-boomer/${version}/fwup_lua_cm2.zip`

export const getPVSFileSystemName = async () => {
  const { pvsFileSystemName } = await getFirmwareVersionData()
  return `firmware/${pvsFileSystemName}`
}
