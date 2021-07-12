import { compose } from 'ramda'

import { trace } from 'shared/utils'

export const statusBluetooth = () =>
  new Promise((resolve, reject) =>
    window.ble.isEnabled(
      compose(resolve, trace('bluetooth is on')),
      compose(reject, trace('bluetooth is off'))
    )
  )
