import { equals, pathOr } from 'ramda'

import { getBLEPath } from 'shared/utils'

export const getBLEDevice = pvsSerialNumber =>
  new Promise((resolve, reject) => {
    let found = false
    window.ble.startScan(
      [],
      device => {
        const sn = pathOr('NOT_FOUND', getBLEPath(), device)

        if (equals(sn, pvsSerialNumber)) {
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
