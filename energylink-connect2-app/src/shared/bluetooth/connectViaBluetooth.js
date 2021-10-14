import { Observable } from 'rxjs'

export const connectBLE = device =>
  new Observable(subscriber => {
    const done = outcome => {
      if (outcome?.error) {
        subscriber.error(outcome.error)
      }

      window.ble.connect(
        device.id,
        function(bleDeviceInfo) {
          subscriber.next(bleDeviceInfo)
        },
        function(error) {
          subscriber.error(error)
        }
      )
    }

    window.bluetoothle.close(done, done, {
      address: device.id
    })
  })
