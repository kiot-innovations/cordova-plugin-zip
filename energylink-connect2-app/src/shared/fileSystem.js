import { compose, defaultTo, head, join, last, slice, split } from 'ramda'
import { flipConcat, PERSIST_DATA_PATH } from 'shared/utils'
import { getMD5FromFile } from 'shared/cordovaMapping'

export const ERROR_CODES = {
  NO_FILESYSTEM_FILE: 'no filesystem file',
  getVersionInfo: 'getVersionInfo',
  getLuaFile: 'getLuaFile',
  noLuaFile: 'noLuaFile',
  parseLuaFile: 'parseLuaFile',
  noWifi: 'No wifi'
}

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
      const file = await fileExists(fileName)
      if (!file) reject(ERROR_CODES.NO_FILESYSTEM_FILE)
      file.file(function(file) {
        const reader = new FileReader()
        reader.onloadend = function() {
          resolve(new Blob([this.result]))
        }
        reader.readAsArrayBuffer(file)
      }, reject)
    } catch (e) {
      reject(new Error(ERROR_CODES.NO_FILESYSTEM_FILE))
    }
  })
export const getFileInfo = (fileName = '') =>
  new Promise(async (resolve, reject) => {
    try {
      const file = await fileExists(fileName)
      if (!file) reject(`The file doesn't exist ${fileName}`)
      file.file(resolve, reject)
    } catch (e) {
      reject(e)
    }
  })
export const getFileSize = async (fileName = '') => {
  const info = await getFileInfo(fileName)
  return {
    byte: info.size,
    kb: (info.size / 1000).toFixed(2),
    mb: (info.size / 1000000).toFixed(2)
  }
}

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
export const getDir = (path = '') =>
  new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(PERSIST_DATA_PATH + path, resolve, reject)
  })

export function listDir(path) {
  return new Promise((resolve, reject) => {
    getDir(path)
      .then(fileSystem => {
        const reader = fileSystem.createReader()
        reader.readEntries(resolve, reject)
      })
      .catch(reject)
  })
}

const getDirPath = compose(join('/'), slice(0, -1), split('/'))

export const fileExists = async (path = '') => {
  try {
    const fileEntries = await listDir(getDirPath(path))
    for (let entry in fileEntries) {
      if (fileEntries[entry].fullPath === `/${path}`) return fileEntries[entry]
    }
    return false
  } catch (e) {
    return false
  }
}

export const deleteFile = (path = '') =>
  new Promise((resolve, reject) => {
    fileExists(path)
      .then(file => {
        if (!file) resolve()
        file.remove(resolve, reject, resolve)
      })
      .catch(reject)
  })

export async function getLatestPVSFirmwareUrl() {
  const res = await fetch(process.env.REACT_APP_LATEST_FIRMWARE_URL)
  return await res.text()
}

export const readFile = path =>
  new Promise(async (resolve, reject) => {
    const fileEntry = await fileExists(path)
    if (!fileEntry) reject("The file doesn't exist")
    fileEntry.file(function(file) {
      const reader = new FileReader()
      reader.onloadend = function() {
        resolve(this.result)
      }
      reader.readAsText(file)
    }, reject)
  })

export const getSHA256FromLuaFile = compose(
  head,
  split("'"),
  last,
  split("hash = '")
)
export const verifySHA256 = async luaPath => {
  const expectedSHA = getSHA256FromLuaFile(
    (await readFile('luaFiles/fwup002.lua')) || ''
  )
  const receivedSHA = await getMD5FromFile(luaPath)

  if (receivedSHA === expectedSHA) {
    const { lastModified, size } = await getFileInfo(luaPath)
    return { lastModified, size }
  }
  throw new Error('The SHA256 is not the same size as expected')
}

export const createSingleDirectory = (fs, newFolder = '') =>
  new Promise((resolve, reject) => {
    fs.getDirectory(newFolder, { create: true }, resolve, reject)
  })

const getFoldersToCreate = split('/')

export const createDirectoryStructure = (path = '') =>
  new Promise(async (resolve, reject) => {
    try {
      const fs = await getDir(path)
      resolve(fs)
    } catch (e) {
      if (e.code === 1) {
        const newFolders = getFoldersToCreate(path)
        for (let i = 0; i < newFolders.length; i++) {
          const newFolder = newFolders[i]
          const fs = await getDir(newFolders.slice(0, i).join('/'))
          await createSingleDirectory(fs, newFolder)
        }
        resolve(await getDir(path))
      }
      reject(e)
    }
  })
export const createFile = path =>
  new Promise(async (resolve, reject) => {
    const getFileName = compose(last, split('/'))
    try {
      const file = await fileExists(path)
      if (file) await deleteFile(path)
      const fs = await createDirectoryStructure(getDirPath(path))
      const fileName = getFileName(path)
      fs.getFile(fileName, { create: true }, resolve, reject)
    } catch (e) {
      reject(e)
    }
  })
