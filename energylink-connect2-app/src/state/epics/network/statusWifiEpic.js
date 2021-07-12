import { always } from 'ramda'
import { ofType } from 'redux-observable'
import { of, timer } from 'rxjs'
import { catchError, map, delayWhen } from 'rxjs/operators'

import {
  CHECK_WIFI_STATUS_SUCCESS,
  CHECK_WIFI_STATUS_ERROR,
  CHECK_WIFI_STATUS_INIT
} from 'state/actions/network'

export const statusWifiEpic = action$ =>
  action$.pipe(
    ofType(CHECK_WIFI_STATUS_INIT.getType()),
    map(() => window.navigator.connection.type),
    map(status =>
      status === 'wifi'
        ? CHECK_WIFI_STATUS_SUCCESS()
        : CHECK_WIFI_STATUS_ERROR()
    ),
    catchError(() => of(CHECK_WIFI_STATUS_ERROR()))
  )

export const statusWifiRetryEpic = action$ =>
  action$.pipe(
    ofType(CHECK_WIFI_STATUS_ERROR.getType()),
    map(always(2 * 1000)),
    delayWhen(timer),
    map(CHECK_WIFI_STATUS_INIT),
    catchError(() => of(CHECK_WIFI_STATUS_INIT()))
  )
