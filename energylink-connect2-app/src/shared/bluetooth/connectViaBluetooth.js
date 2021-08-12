import { compose } from 'ramda'
import { Observable } from 'rxjs'

import { trace } from 'shared/utils'

export const connectBLE = device =>
  new Observable(subscriber => {
    const done = outcome => {
      console.info({ outcome })
      window.ble.connect(
        device.id,
        compose(bleDeviceInfo => {
          console.info({ bleDeviceInfo })
          subscriber.next(bleDeviceInfo)
        }, trace('ble.connect_SUCCESS')),
        compose(error => subscriber.error(error), trace('ble.connect_FAILED'))
      )
    }

    window.bluetoothle.close(done, done, {
      address: device.id
    })
  })
