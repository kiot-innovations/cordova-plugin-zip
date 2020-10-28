import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import {
  catchError,
  map,
  exhaustMap,
  retryWhen,
  mergeMap,
  delayWhen
} from 'rxjs/operators'
import { from, of, timer } from 'rxjs'
import {
  CONNECT_PVS_VIA_BLE,
  EXECUTE_ENABLE_ACCESS_POINT,
  FAILURE_BLUETOOTH_ACTION
} from 'state/actions/network'
import { connectBLE } from 'shared/bluetooth/connectViaBluetooth'

export const connectPVSViaBluetoothEpic = (action$, state$) => {
  return action$.pipe(
    ofType(CONNECT_PVS_VIA_BLE.getType()),
    exhaustMap(({ payload: bleDevice }) => {
      console.warn('WILL ENABLE BLE WITH:')
      console.warn({ bleDevice })

      return from(connectBLE(bleDevice)).pipe(
        map(EXECUTE_ENABLE_ACCESS_POINT),
        retryWhen(errors =>
          errors.pipe(
            mergeMap((error, i) => {
              console.warn('Got Error', { i })
              console.error({ error })
              return delayWhen(e => timer(7 * 1000))
            })
          )
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'CONNECT_TO_PVS_VIA_BLE' })
          Sentry.captureException(err)
          return of(FAILURE_BLUETOOTH_ACTION()) // TODO: Use an actionable ACTION
        })
      )
    })
  )
}
