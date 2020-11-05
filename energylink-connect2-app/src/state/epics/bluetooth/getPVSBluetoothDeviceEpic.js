import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { path } from 'ramda'
import {
  ENABLE_ACCESS_POINT,
  CONNECT_PVS_VIA_BLE,
  FAILURE_BLUETOOTH_ACTION
} from 'state/actions/network'
import { getBLEDevice } from 'shared/bluetooth/getBluetoothDevice'

export const getPVSBluetoothDeviceEpic = (action$, state$) => {
  return action$.pipe(
    ofType(ENABLE_ACCESS_POINT.getType()),
    exhaustMap(() => {
      const { serialNumber } = path(['value', 'pvs'], state$)
      return from(getBLEDevice(serialNumber)).pipe(
        map(CONNECT_PVS_VIA_BLE),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'BLE_DEVICE_SCAN_ERROR' })
          Sentry.captureException(err)
          return of(FAILURE_BLUETOOTH_ACTION()) // TODO: Use an actionable ACTION
        })
      )
    })
  )
}
