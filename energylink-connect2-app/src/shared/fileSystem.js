import { compose, defaultTo, head, join, last, slice, split } from 'ramda'
import { flipConcat } from 'shared/utils'

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
  defaultTo(''),
  head,
  slice(-4, -3),
  split('/'),
  defaultTo('')
)

const getBuildNumber = compose(
  Number,
  join(' '),
  split('-'),
  defaultTo(''),
  head,
  slice(-3, -2),
  split('/'),
  defaultTo('')
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
              const sizeRegex = /dlsize\s=\s\S*/gm

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
              resolve(size)
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
  new Promise(async (resolve, reject) => {
    try {
      const file = await getFileInfo(fileName)
      const reader = new FileReader()
      reader.onloadend = function() {
        resolve(new Blob([this.result]))
      }
      reader.readAsArrayBuffer(file)
    } catch (e) {
      reject(new Error(ERROR_CODES.NO_FILESYSTEM_FILE))
    }
  })

export const getFirmwareVersionData = fileURL => {
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
}

export const getFS = compose(
  flipConcat('/fwup_lua_cm2.zip'),
  join('/'),
  slice(0, -2),
  split('/')
)

export const getPVSFileSystemName = fileUrl => {
  const { pvsFileSystemName } = getFirmwareVersionData(fileUrl)
  return `firmware/${pvsFileSystemName}`
}

export function listDir(path) {
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(
      path,
      function(fileSystem) {
        const reader = fileSystem.createReader()
        reader.readEntries(resolve, reject)
      },
      reject
    )
  })
}

export const fileExists = async (path = '') => {
  const getDirPath = compose(join('/'), slice(0, -1), split('/'))
  const getFilePath = compose(last, split('persistent'))
  try {
    const fileEntries = await listDir(getDirPath(path))
    const file = getFilePath(path)
    for (let entry in fileEntries) {
      if (fileEntries[entry].fullPath === file) return fileEntries[entry]
    }
    return false
  } catch (e) {
    return false
  }
}
