import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { catchError, map, mergeMap, retryWhen } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { connectBLE } from 'shared/bluetooth/connectViaBluetooth'
import genericRetryStrategy from 'shared/rxjs/genericRetryStrategy'
import { TAGS } from 'shared/utils'
import {
  CONNECT_PVS_VIA_BLE,
  EXECUTE_ENABLE_ACCESS_POINT,
  FAILURE_BLUETOOTH_ACTION
} from 'state/actions/network'

export const connectPVSViaBluetoothEpic = action$ => {
  return action$.pipe(
    ofType(CONNECT_PVS_VIA_BLE.getType()),
    mergeMap(({ payload: bleDevice }) =>
      connectBLE(bleDevice).pipe(
        map(EXECUTE_ENABLE_ACCESS_POINT),
        retryWhen(genericRetryStrategy({ maxRetryAttempts: 4 })),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'CONNECT_TO_PVS_VIA_BLE' })
          Sentry.setTag(TAGS.KEY.PVS, TAGS.VALUE.CONNECT_TO_PVS_VIA_BLE)
          Sentry.captureException(err)
          return of(FAILURE_BLUETOOTH_ACTION()) // TODO: Use an actionable ACTION
        })
      )
    )
  )
}
