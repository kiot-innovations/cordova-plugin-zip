import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {
  EXECUTE_ENABLE_ACCESS_POINT,
  EXECUTE_ENABLE_ACCESS_POINT_SUCCESS,
  FAILURE_BLUETOOTH_ACTION
} from 'state/actions/network'
import { enableAccessPointOnPVS } from 'shared/bluetooth/enableAPViaBluetooth'

export const enableAccessPointViaBluetoothEpic = (action$, state$) => {
  return action$.pipe(
    ofType(EXECUTE_ENABLE_ACCESS_POINT.getType()),
    exhaustMap(({ payload: bleConnectionInfo }) => {
      console.warn('EXECUTE_ENABLE_ACCESS_POINT:')
      console.warn({ bleConnectionInfo })

      return from(enableAccessPointOnPVS(bleConnectionInfo)).pipe(
        map(EXECUTE_ENABLE_ACCESS_POINT_SUCCESS),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'EXECUTE_ENABLE_ACCESS_POINT' })
          Sentry.captureException(err)
          return of(FAILURE_BLUETOOTH_ACTION())
        })
      )
    })
  )
}
