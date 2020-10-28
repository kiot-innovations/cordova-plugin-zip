import { compose } from 'ramda'
import { trace } from 'shared/utils'

export const connectBLE = device =>
  new Promise((resolve, reject) => {
    window.ble.connect(
      device.id,
      compose(resolve, trace('ble.connect success')),
      compose(reject, trace('ble.connect failed'))
    )
  })
