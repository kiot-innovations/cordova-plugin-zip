import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {
  CONNECT_PVS_VIA_BLE,
  EXECUTE_ENABLE_ACCESS_POINT,
  FAILURE_BLUETOOTH_ACTION
} from 'state/actions/network'
import { connectBLE } from 'shared/bluetooth/connectViaBluetooth'

export const connectPVSViaBluetoothEpic = action$ => {
  return action$.pipe(
    ofType(CONNECT_PVS_VIA_BLE.getType()),
    exhaustMap(({ payload: bleDevice }) =>
      from(connectBLE(bleDevice)).pipe(
        map(EXECUTE_ENABLE_ACCESS_POINT),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'CONNECT_TO_PVS_VIA_BLE' })
          Sentry.captureException(err)
          return of(FAILURE_BLUETOOTH_ACTION()) // TODO: Use an actionable ACTION
        })
      )
    )
  )
}
