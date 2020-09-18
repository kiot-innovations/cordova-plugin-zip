import { Observable } from 'rxjs'
import { createFile, deleteFile, fileExists } from 'shared/fileSystem'

const parseHeaders = (headers, xhr) => {
  const result = {}
  headers.forEach(elem => {
    result[elem] = xhr.getResponseHeader(elem)
  })
  return result
}

const fileTransferObservable = (
  path,
  url,
  retry = false,
  accessToken,
  headers = ['']
) =>
  new Observable(subscriber => {
    let fileSize = 0
    const successCallback = entry => {
      subscriber.next({ entry, total: fileSize })
      subscriber.complete()
    }
    const errorCallback = error =>
      deleteFile(path).then(() => {
        subscriber.error({ ...error, url })
        subscriber.complete()
      })
    fileExists(path).then(async entry => {
      if (retry) await deleteFile(path)
      if (!entry || retry) {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.setRequestHeader(
          'Cache-Control',
          'no-cache, must-revalidate, post-check=0, pre-check=0'
        )
        xhr.setRequestHeader('Cache-Control', 'max-age=0')
        xhr.setRequestHeader('expires', '0')
        xhr.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT')
        xhr.setRequestHeader('pragma', 'no-cache')
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
            errorCallback({
              status: xhr.status,
              text: xhr.statusText
            })
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
                    progress: ((written / blob.size) * 100).toFixed(0)
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
        xhr.onerror = errorCallback
        xhr.send()
      } else successCallback(entry)
    })
  })

export default fileTransferObservable
