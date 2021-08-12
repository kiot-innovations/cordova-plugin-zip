import { isEmpty } from 'ramda'
import { ofType } from 'redux-observable'
import { EMPTY, of } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'

import {
  getPairedDevicesBluetooth,
  toDevice
} from 'shared/bluetooth/getPairedDevicesBluetooth'
import {
  ENABLE_BLUETOOTH_ERROR,
  CHECK_BLUETOOTH_STATUS_SUCCESS,
  CONNECT_PVS_VIA_BLE
} from 'state/actions/network'

export const getPairedPVSEpic = action$ => {
  return action$.pipe(
    ofType(CHECK_BLUETOOTH_STATUS_SUCCESS.getType()),
    mergeMap(() =>
      getPairedDevicesBluetooth().pipe(
        mergeMap(data => {
          console.info({ data })
          const compatibleBLEs = data.map(toDevice)
          const payload = compatibleBLEs.map(CONNECT_PVS_VIA_BLE)
          console.info({ compatibleBLEs, payload })
          return isEmpty(payload) ? EMPTY : of(...payload)
        }),
        catchError(() => {
          console.warn('ENABLE CATCH ERROR')
          return of(ENABLE_BLUETOOTH_ERROR())
        })
      )
    )
  )
}
