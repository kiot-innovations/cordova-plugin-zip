import { equals, pathOr } from 'ramda'

export const getBLEDevice = pvsSerialNumber =>
  new Promise((resolve, reject) => {
    window.ble.scan(
      [],
      20,
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
          resolve(device)
        }
      },
      reject
    )
  })
