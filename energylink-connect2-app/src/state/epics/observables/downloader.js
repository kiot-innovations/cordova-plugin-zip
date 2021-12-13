import { prop, filter, identity } from 'ramda'
import { Observable } from 'rxjs'

import {
  createFile,
  deleteFile,
  fileExists,
  deleteFilesDirectory
} from 'shared/fileSystem'

const createHeadersObj = headers => {
  const parsedHeaders = {}
  const arr = headers.trim().split(/[\r\n]+/)
  arr.forEach(line => {
    const parts = line.split(': ')
    const header = parts.shift()
    const value = parts.join(': ')
    parsedHeaders[header] = value
  })
  return parsedHeaders
}

const parseHeaders = (headers, xhr) => {
  const result = {}
  const responseHeaders = createHeadersObj(xhr.getAllResponseHeaders())
  headers.forEach(elem => {
    result[elem] = prop(elem, responseHeaders)
  })
  return filter(identity)(result)
}

const fileTransferObservable = ({
  path,
  url,
  retry = false,
  accessToken,
  fileExtensions = [],
  headers = ['']
}) =>
  new Observable(subscriber => {
    let fileSize = 0
    const successCallback = entry => {
      subscriber.next({ entry, total: fileSize })
      subscriber.complete()
    }
    const errorCallback = (error, requestHeaders, responseHeaders) =>
      deleteFile(path).then(() => {
        subscriber.error({ ...error, url, requestHeaders, responseHeaders })
        subscriber.complete()
      })

    fileExists(path).then(async entry => {
      if (retry) await deleteFile(path)
      if (!entry) {
        if (Array.isArray(fileExtensions)) {
          for (const fileExtension of fileExtensions) {
            await deleteFilesDirectory(path, fileExtension)
          }
        }
      }
      if (!entry || retry) {
        const xhr = new XMLHttpRequest()
        const timeoutMiliseconds = url.includes('gridprofiles')
          ? 180000
          : 300000
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.timeout = timeoutMiliseconds
        const requestHeaders = {
          'Cache-Control':
            'no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0',
          expires: '0',
          pragma: 'no-cache',
          'debug-header': new Date().getTime()
        }
        for (const [key, value] of Object.entries(requestHeaders)) {
          if (value === undefined) continue
          xhr.setRequestHeader(key, value)
        }
        if (accessToken)
          xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
        let lastProgress = 0
        xhr.onprogress = ({ loaded, total }) => {
          if (fileSize === 0) fileSize = total
          const progress = ((loaded / total) * 100).toFixed(0)
          if (lastProgress !== progress) {
            lastProgress = progress
            subscriber.next({ progress, total, step: 'DOWNLOADING' })
          }
        }
        xhr.onload = function() {
          if (xhr.status !== 200)
            errorCallback(
              {
                status: xhr.status,
                text: xhr.statusText
              },
              requestHeaders,
              createHeadersObj(xhr.getAllResponseHeaders())
            )
          const blob = this.response

          createFile(path).then(fileEntry => {
            fileEntry.createWriter(fileWritter => {
              let written = 0
              const BLOCK_SIZE = 1 * 1024 * 1024 // 1 MB Chunk
              function writeNext(cbFinish) {
                const sz = Math.min(BLOCK_SIZE, blob.size - written)
                const sub = blob.slice(written, written + sz)
                fileWritter.write(sub)
                written += sz
                fileWritter.onwrite = function() {
                  subscriber.next({
                    step: 'WRITING_FILE',
                    progress: ((written / blob.size) * 100).toFixed(0),
                    total: fileSize
                  })
                  if (written < blob.size) writeNext(cbFinish)
                  else cbFinish()
                }
              }

              writeNext(() => {
                subscriber.next({
                  total: fileSize,
                  serverHeaders: parseHeaders(headers, xhr),
                  entry: fileEntry
                })
                subscriber.complete()
              })
            })
          })
        }

        xhr.ontimeout = function() {
          function timeOutError(error = '') {
            this.error = error
          }
          timeOutError.prototype = new Error()
          const errorCode = 'REQUEST_TIMEOUT'
          const error = new timeOutError(errorCode)

          return errorCallback(
            error,
            requestHeaders,
            createHeadersObj(xhr.getAllResponseHeaders())
          )
        }

        xhr.onerror = function(err) {
          return errorCallback(
            err,
            requestHeaders,
            createHeadersObj(xhr.getAllResponseHeaders())
          )
        }
        xhr.send()
      } else successCallback(entry)
    })
  })

export default fileTransferObservable
