import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { pathOr } from 'ramda'
import {
  EXECUTE_ENABLE_ACCESS_POINT,
  EXECUTE_ENABLE_ACCESS_POINT_SUCCESS,
  FAILURE_BLUETOOTH_ACTION,
  PVS_CONNECTION_INIT
} from 'state/actions/network'
import { enableAccessPointOnPVS } from 'shared/bluetooth/enableAPViaBluetooth'

export const enableAccessPointViaBluetoothEpic = action$ => {
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

export const reConnectToPVSWiFiEpic = (action$, state$) => {
  return action$.pipe(
    ofType(EXECUTE_ENABLE_ACCESS_POINT_SUCCESS.getType()),
    map(() => {
      console.warn('EXECUTE_ENABLE_ACCESS_POINT_SUCCESS:')
      const ssid = pathOr('', ['value', 'network', 'SSID'], state$)
      const password = pathOr('', ['value', 'network', 'password'], state$)
      console.warn({ ssid, password })

      return PVS_CONNECTION_INIT({ ssid, password })
    }),
    catchError(err => {
      Sentry.addBreadcrumb({ message: 'EXECUTE_ENABLE_ACCESS_POINT' })
      Sentry.captureException(err)
      return of(FAILURE_BLUETOOTH_ACTION())
    })
  )
}
