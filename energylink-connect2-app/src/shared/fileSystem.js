import {
  compose,
  defaultTo,
  head,
  includes,
  join,
  last,
  map,
  match,
  replace,
  slice,
  split,
  tail
} from 'ramda'

import { getSHA256FromFile } from 'shared/cordovaMapping'
import { flipConcat, PERSIST_DATA_PATH } from 'shared/utils'

export const ERROR_CODES = {
  NO_FILESYSTEM_FILE: 'no filesystem file',
  MD5_NOT_MATCHING: 'MD5_NOT_MATCHING',
  getVersionInfo: 'getVersionInfo',
  getLuaFile: 'getLuaFile',
  noLuaFile: 'noLuaFile',
  noWifi: 'No WiFi'
}

export const getFileNameFromURL = compose(last, split('/'))

export const getLuaName = compose(
  join(' '),
  split('-'),
  defaultTo(''),
  head,
  slice(-4, -3),
  split('/'),
  defaultTo('')
)

export const getBuildNumber = compose(
  Number,
  join(' '),
  split('-'),
  defaultTo(''),
  head,
  slice(-3, -2),
  split('/'),
  defaultTo('')
)

export const getFileBlob = (fileName = '') =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const file = await fileExists(fileName)

      if (!file) {
        reject(ERROR_CODES.NO_FILESYSTEM_FILE)
      }

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
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const file = await fileExists(fileName)

      if (!file) {
        reject(`The file doesn't exist ${fileName}`)
      }

      file.file(resolve, reject)
    } catch (e) {
      reject(e)
    }
  })

export const getPVS5LuaName = compose(
  join(' '),
  split('-'),
  head,
  slice(-3, -2),
  split('/'),
  defaultTo('')
)

export const getPVS5BuildNumber = compose(
  Number,
  join(' '),
  split('-'),
  defaultTo(''),
  head,
  slice(-2, -1),
  split('/'),
  defaultTo('')
)

export const getPVS5FwVersionData = fileUrl => {
  const versionName = getPVS5LuaName(fileUrl)
  const buildNumber = getPVS5BuildNumber(fileUrl)
  const baseFileName = `${versionName}-${buildNumber}`.replace(/ /g, '-')

  return {
    versionName,
    buildNumber,
    baseFileName,
    pvsFileSystemName: `${baseFileName}.fs`,
    pvsScriptsName: `${baseFileName}.scripts`,
    pvsKernelName: `${baseFileName}.kernel`,
    luaDownloadName: `${baseFileName}.lua`
  }
}

export const getPVS5LuaUrl = compose(
  flipConcat('/fwup_lua_cm2.zip'),
  join('/'),
  slice(0, -1),
  split('/')
)

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

export const getPathDir = compose(join('/'), slice(0, -1), split('/'))

export const fileExists = async (path = '') => {
  try {
    const pathDir = getPathDir(path)
    const fileEntries = await listDir(pathDir)

    for (let entry in fileEntries) {
      if (fileEntries[entry].fullPath === `/${path}`) {
        return fileEntries[entry]
      }
    }

    return false
  } catch (e) {
    return false
  }
}

export const deleteFile = (path = '') =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise((resolve, reject) => {
    fileExists(path)
      .then(file => {
        if (!file) resolve()
        file.remove(resolve, reject, resolve)
      })
      .catch(reject)
  })

export const readFile = path =>
  new Promise((resolve, reject) => {
    fileExists(path).then(fileEntry => {
      if (!fileEntry) {
        reject("The file doesn't exist")
      }

      fileEntry.file(function(file) {
        const reader = new FileReader()

        reader.onloadend = function() {
          resolve(this.result)
        }

        reader.readAsText(file)
      }, reject)
    })
  })

export const getSHA256FromLuaFile = compose(
  head,
  split("'"),
  last,
  split("hash = '")
)

export const verifySHA256 = async fwPath => {
  const expectedSHA = getSHA256FromLuaFile(
    (await readFile('luaFiles/fwup002.lua')) || ''
  )
  const receivedSHA = await getSHA256FromFile(fwPath)

  if (receivedSHA === expectedSHA) {
    const { lastModified, size } = await getFileInfo(fwPath)
    return { lastModified, size }
  }

  throw new Error('The SHA256 is not the same size as expected')
}

const parseHashesStrings = map(
  compose(replace(/['"]+/g, ''), head, match(/"\w+"/gm))
)

const getPossibleHashes = compose(
  parseHashesStrings,
  match(/hash\s+=\s"\w+"/gm)
)

export const verifyPvS5SHA256 = async fwPath => {
  // All lua files contain the same hashes for the same files,
  // using any file is OK
  const ARBITRARY_LUA_FILE_PATH = 'pvs5-luaFiles/fwup002.lua'

  const luaFile = (await readFile(ARBITRARY_LUA_FILE_PATH)) || ''
  const hashesFromLuaFile = getPossibleHashes(luaFile)
  const downloadedFileHash = await getSHA256FromFile(fwPath)

  if (includes(downloadedFileHash, hashesFromLuaFile)) {
    const { lastModified, size } = await getFileInfo(fwPath)

    return { lastModified, size }
  }

  throw new Error(
    `The SHA hash for the downloaded file ${fwPath} is not present in the file ${ARBITRARY_LUA_FILE_PATH}`
  )
}

export const createSingleDirectory = (fs, newFolder = '') =>
  new Promise((resolve, reject) => {
    fs.getDirectory(newFolder, { create: true }, resolve, reject)
  })

const getFoldersToCreate = split('/')

export const createDirectoryStructure = (path = '') =>
  // eslint-disable-next-line no-async-promise-executor
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
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const getFileName = compose(last, split('/'))
    try {
      const file = await fileExists(path)

      if (file) {
        await deleteFile(path)
      }

      const fs = await createDirectoryStructure(getPathDir(path))
      const fileName = getFileName(path)

      fs.getFile(fileName, { create: true }, resolve, reject)
    } catch (e) {
      reject(e)
    }
  })

export const getFileExtension = compose(last, split('.'))

export const getFullPath = compose(join('/'), tail, split('/'))

export async function deleteDirectoryFiles(dir, fileExtensionToDelete = '') {
  if (!dir) {
    throw new Error('Please specify a directory')
  }

  try {
    const fileEntries = await listDir(dir)

    for (const file of fileEntries) {
      const { fullPath, isFile } = file
      const fileExtension = getFileExtension(fullPath)
      const fileFullPath = getFullPath(fullPath)

      if (!isFile) {
        continue
      }

      if (fileExtension === fileExtensionToDelete) {
        await deleteFile(fileFullPath)
      }
    }
  } catch {
    return false
  }
}
