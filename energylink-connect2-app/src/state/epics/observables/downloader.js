import { Observable } from 'rxjs'
import { PERSIST_DATA_PATH } from 'shared/utils'
import { fileExists } from 'shared/fileSystem'

const fileTransferObservable = (path, url, retry = false, accessToken) =>
  new Observable(subscriber => {
    const localFileUrl = `${PERSIST_DATA_PATH}${path}`
    let fileSize = 0
    const successCallback = entry => {
      subscriber.next({ entry, total: fileSize })
      subscriber.complete()
    }
    const errorCallback = error => {
      subscriber.error({ ...error, url })
      subscriber.complete()
    }
    fileExists(localFileUrl).then(entry => {
      if (!entry || retry) {
        const fileTransfer = new window.FileTransfer()
        const uri = encodeURI(url)
        let lastProgress = 0
        fileTransfer.onprogress = data => {
          const { loaded, total } = data
          if (fileSize === 0) fileSize = total
          const progress = ((loaded / total) * 100).toFixed(0)
          if (lastProgress !== progress) {
            lastProgress = progress
            subscriber.next({ progress, total })
          }
        }
        fileTransfer.download(
          uri,
          localFileUrl,
          successCallback,
          errorCallback,
          true,
          accessToken
            ? {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              }
            : {}
        )
      } else successCallback(entry)
    })
  })

export default fileTransferObservable
