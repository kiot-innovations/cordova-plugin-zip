import { Observable } from 'rxjs'
import { compose } from 'ramda'
import { trace } from 'shared/utils'

export const connectBLE = device =>
  new Observable(subscriber => {
    window.ble.connect(
      device.id,
      compose(
        bleDeviceInfo => subscriber.next(bleDeviceInfo),
        trace('ble.connect_SUCCESS')
      ),
      compose(error => subscriber.error(error), trace('ble.connect_FAILED'))
    )
  })
