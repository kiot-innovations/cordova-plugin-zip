import { Observable } from 'rxjs'

const services = [
  '6DAEAE98-3293-4717-9559-34578608798B',
  '0A14BBD4-E2F0-4820-A1BE-A39ED197D9C4'
]

// input { address: '123455,' name: 'pvs6' }
// output { id: '123455', name: 'pvs6' }
export const toDevice = d => ({ ...d, id: d.address })

export const getPairedDevicesBluetooth = () =>
  new Observable(subscriber => {
    window.bluetoothle.initialize(console.info)
    window.bluetoothle.retrieveConnected(
      connectedDevices => {
        subscriber.next(connectedDevices)
        subscriber.complete()
      },
      () => {
        subscriber.next([])
        subscriber.complete()
      },
      { services }
    )
  })
