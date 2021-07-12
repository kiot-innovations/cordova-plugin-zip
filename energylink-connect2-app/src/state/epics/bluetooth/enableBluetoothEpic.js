import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, exhaustMap } from 'rxjs/operators'

import { enableBluetooth } from 'shared/bluetooth/enableBluetooth'
import {
  ENABLE_BLUETOOTH_INIT,
  ENABLE_BLUETOOTH_SUCCESS,
  ENABLE_BLUETOOTH_ERROR
} from 'state/actions/network'

export const enableBluetoothEpic = action$ => {
  return action$.pipe(
    ofType(ENABLE_BLUETOOTH_INIT.getType()),
    exhaustMap(() =>
      from(enableBluetooth()).pipe(
        map(ENABLE_BLUETOOTH_SUCCESS),
        catchError(() => {
          console.warn('ENABLE CATCH ERROR')
          return of(ENABLE_BLUETOOTH_ERROR())
        })
      )
    )
  )
}
