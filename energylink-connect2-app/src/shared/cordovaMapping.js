import { fileExists } from 'shared/fileSystem'

export const getMd5FromFile = (filePath = '') =>
  new Promise((resolve, reject) => {
    fileExists(filePath).then(fileEntry => {
      if (!fileEntry) throw Error("The file doesn't exist")
      window.md5chksum.file(fileEntry, resolve, reject)
    })
  })

export const checkMD5 = async (filePath = '', expectedMd5 = '') => {
  const md5 = await getMd5FromFile(filePath)
  if (expectedMd5 === md5) return true
  throw new Error('MD5 are not the same')
}

export const cdvfileToNativePath = (filePath = '') =>
  new Promise((resolve, reject) => {
    fileExists(filePath)
      .then(fileEntry => {
        if (!fileEntry) reject("The file doesn't exists")
        resolve(fileEntry.toURL())
      })
      .catch(reject)
  })

export const getMD5FromFile = (filePath = '') => {
  return new Promise((resolve, reject) => {
    cdvfileToNativePath(filePath)
      .then(nativePath => {
        window.FileHash.sha256(
          nativePath,
          ({ result }) => resolve(result),
          reject
        )
      })
      .catch(reject)
  })
}
