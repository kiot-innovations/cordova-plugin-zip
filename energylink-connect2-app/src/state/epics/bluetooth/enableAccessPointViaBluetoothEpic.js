import { pathOr, isEmpty } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, EMPTY } from 'rxjs'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { enableAccessPointOnPVS } from 'shared/bluetooth/enableAPViaBluetooth'
import { TAGS } from 'shared/utils'
import {
  EXECUTE_ENABLE_ACCESS_POINT,
  EXECUTE_ENABLE_ACCESS_POINT_SUCCESS,
  FAILURE_BLUETOOTH_ACTION,
  PVS_CONNECTION_INIT
} from 'state/actions/network'
import { EMPTY_ACTION } from 'state/actions/share'

export const enableAccessPointViaBluetoothEpic = action$ => {
  return action$.pipe(
    ofType(EXECUTE_ENABLE_ACCESS_POINT.getType()),
    exhaustMap(({ payload: bleConnectionInfo }) =>
      from(enableAccessPointOnPVS(bleConnectionInfo)).pipe(
        map(EXECUTE_ENABLE_ACCESS_POINT_SUCCESS),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'EXECUTE_ENABLE_ACCESS_POINT' })
          Sentry.setTag(TAGS.KEY.PVS, TAGS.VALUE.EXECUTE_ENABLE_ACCESS_POINT)
          Sentry.captureException(err)
          return of(FAILURE_BLUETOOTH_ACTION())
        })
      )
    )
  )
}

export const reConnectToPVSWiFiEpic = (action$, state$) => {
  return action$.pipe(
    ofType(
      EXECUTE_ENABLE_ACCESS_POINT_SUCCESS.getType(),
      FAILURE_BLUETOOTH_ACTION.getType()
    ),
    map(() => {
      const ssid = pathOr('', ['value', 'network', 'SSID'], state$)
      const password = pathOr('', ['value', 'network', 'password'], state$)
      return !isEmpty(ssid) && !isEmpty(password)
        ? PVS_CONNECTION_INIT({ ssid, password })
        : EMPTY_ACTION()
    }),
    catchError(err => {
      Sentry.addBreadcrumb({ message: 'EXECUTE_ENABLE_ACCESS_POINT' })
      Sentry.captureException(err)
      return EMPTY
    })
  )
}
