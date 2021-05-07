import { pathOr } from 'ramda'
import { Observable } from 'rxjs'
import { getBLEPath } from 'shared/utils'

export const getBLEDeviceList = () =>
  new Observable(subscriber => {
    window.ble.scan(
      [],
      30,
      device => {
        const name = pathOr(null, getBLEPath, device)

        subscriber.next({ name, id: device.id })
      },
      subscriber.error
    )
    setTimeout(() => {
      subscriber.complete()
    }, 30000)
  })
