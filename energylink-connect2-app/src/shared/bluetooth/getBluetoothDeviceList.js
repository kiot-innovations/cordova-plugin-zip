import { pathOr } from 'ramda'
import { Observable } from 'rxjs'

import { getBLEPath } from 'shared/utils'

export const getBLEDeviceList = () =>
  new Observable(subscriber => {
    window.ble.scan(
      [],
      20,
      dev => {
        const name = pathOr(null, getBLEPath(), dev)
        const device = { name, id: dev.id }
        const response = { device, ended: false }
        subscriber.next(response)
      },
      error => {
        subscriber.error(error)
      }
    )
    setTimeout(() => {
      subscriber.next({ device: null, ended: true })
      subscriber.complete()
    }, 22000)
  })
