import { compose } from 'ramda'
import { trace, isIos } from 'shared/utils'

// needs to be manually enabled on iOS
export const enableBluetooth = () =>
  new Promise((resolve, reject) =>
    isIos()
      ? reject()
      : window.ble.enable(
          compose(resolve, trace('bluetooth enabled')),
          compose(reject, trace('bluetooth not enabled'))
        )
  )
