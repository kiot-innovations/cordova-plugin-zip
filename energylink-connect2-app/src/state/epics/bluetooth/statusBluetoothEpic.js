import { always } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, map, delayWhen, mergeMap } from 'rxjs/operators'

import { statusBluetooth } from 'shared/bluetooth/statusBluetooth'
import {
  CHECK_BLUETOOTH_STATUS_INIT,
  CHECK_BLUETOOTH_STATUS_SUCCESS,
  ENABLE_BLUETOOTH_ERROR
} from 'state/actions/network'

export const statusBluetoothEpic = action$ => {
  return action$.pipe(
    ofType(CHECK_BLUETOOTH_STATUS_INIT.getType()),
    mergeMap(() =>
      from(statusBluetooth()).pipe(
        map(CHECK_BLUETOOTH_STATUS_SUCCESS),
        catchError(error => {
          console.error('CHECK_BLUETOOTH_STATUS_INIT')
          console.error({ error })
          return of(ENABLE_BLUETOOTH_ERROR(error))
        })
      )
    )
  )
}

export const statusBluetoothRetryEpic = action$ =>
  action$.pipe(
    ofType(ENABLE_BLUETOOTH_ERROR.getType()),
    map(always(2 * 1000)),
    delayWhen(timer),
    map(CHECK_BLUETOOTH_STATUS_INIT),
    catchError(() => of(CHECK_BLUETOOTH_STATUS_INIT()))
  )
