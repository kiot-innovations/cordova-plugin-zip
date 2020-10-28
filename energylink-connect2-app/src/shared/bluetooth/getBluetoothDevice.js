import { equals, pathOr } from 'ramda'

export const getBLEDevice = pvsSerialNumber =>
  new Promise((resolve, reject) => {
    let found = false
    window.ble.startScan(
      [],
      device => {
        const sniOS = pathOr(
          'NOT_FOUND',
          ['advertising', 'kCBAdvDataLocalName'],
          device
        )

        const snAndroid = pathOr('NOT_FOUND', ['name'], device)

        console.info({ sniOS, snAndroid })

        if (
          equals(sniOS, pvsSerialNumber) ||
          equals(snAndroid, pvsSerialNumber)
        ) {
          found = true
          resolve(device)
        }
      },
      reject
    )

    setTimeout(
      () =>
        window.ble.stopScan(() => {
          if (!found) reject('NOT_FOUND')
        }, reject),
      30000
    )
  })
