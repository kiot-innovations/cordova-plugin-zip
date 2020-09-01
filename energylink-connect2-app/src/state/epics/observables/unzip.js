import { PERSIST_DATA_PATH } from 'shared/utils'
import { compose, join, slice, split } from 'ramda'
import { Observable } from 'rxjs'

const unzipObservable = (sourceFile = '') =>
  new Observable(subscriber => {
    const getExtractionFolder = compose(join('/'), slice(0, -1), split('/'))

    const onComplete = result => {
      if (result === 0) {
        subscriber.next({ complete: true })
        subscriber.complete()
      } else {
        subscriber.error({
          error: 'Error decompressing the zip file',
          file: sourceFile
        })
        subscriber.complete()
      }
    }
    window.zip.unzip(
      PERSIST_DATA_PATH + sourceFile,
      PERSIST_DATA_PATH + getExtractionFolder(sourceFile),
      onComplete
    )
  })

export default unzipObservable
