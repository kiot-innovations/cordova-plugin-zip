import { equals, pathOr } from 'ramda'
import { Observable } from 'rxjs'

import { getBLEPath } from 'shared/utils'

export const getBLEDevice = pvsSerialNumber =>
  new Observable(subscriber => {
    let found = false
    window.ble.startScan(
      [],
      device => {
        const sn = pathOr('NOT_FOUND', getBLEPath(), device)

        if (equals(sn, pvsSerialNumber)) {
          found = true
          subscriber.next({ devices: [device] })
          subscriber.complete()
        }
      },
      error => subscriber.error(error)
    )

    setTimeout(() => {
      window.ble.stopScan(
        () => {
          if (!found) {
            subscriber.next({ devices: [] })
            subscriber.complete()
          }
        },
        error => subscriber.error(error)
      )
    }, 20000)
  })
