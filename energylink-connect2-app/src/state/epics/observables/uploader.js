import { Observable } from 'rxjs'

const uploaderObservable = ({ file, url, accessToken }) =>
  new Observable(subscriber => {
    subscriber.next({ message: 'PREPARING_FILE' })
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    if (accessToken)
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.upload.onprogress = function(event) {
      const { loaded, total } = event
      const progress = ((loaded / total) * 100).toFixed(0)
      subscriber.next({ message: 'UPLOAD_PROGRESS', progress, total })
    }
    const errorCallback = () => {
      subscriber.error({ message: 'UPLOAD_ERROR', status: xhr.status })
    }
    xhr.upload.onerror = errorCallback
    xhr.onerror = errorCallback
    xhr.onloadend = function() {
      if (xhr.status === 200) {
        subscriber.next({ message: 'UPLOAD_COMPLETE' })
        subscriber.complete()
      } else {
        errorCallback()
        subscriber.complete()
      }
    }
    xhr.send(file)
  })

export default uploaderObservable
