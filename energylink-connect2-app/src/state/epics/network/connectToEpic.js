import { pathOr, test } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { isIos } from 'shared/utils'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING,
  WAIT_FOR_SWAGGER
} from 'state/actions/network'

const WPA = 'WPA'
const hasCode7 = test(/Code=7/)

const connectToEpic = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_INIT.getType()),
    mergeMap(async action => {
      const ssid = pathOr('', ['payload', 'ssid'], action)
      const password = pathOr('', ['payload', 'password'], action)
      try {
        if (isIos()) {
          await window.WifiWizard2.iOSConnectNetwork(ssid, password)
        } else {
          await window.WifiWizard2.connect(ssid, true, password, WPA, false)
        }
        return WAIT_FOR_SWAGGER()
      } catch (err) {
        if (hasCode7(err)) {
          return STOP_NETWORK_POLLING()
        } else {
          return PVS_CONNECTION_INIT({ ssid: ssid, password: password })
        }
      }
    })
  )

export const waitForSwaggerEpic = action$ => {
  const stopPolling$ = action$.pipe(ofType(PVS_CONNECTION_SUCCESS.getType()))

  return action$.pipe(
    ofType(WAIT_FOR_SWAGGER.getType()),
    switchMap(() =>
      timer(0, 2000).pipe(
        takeUntil(stopPolling$),
        switchMap(() =>
          from(getApiPVS()).pipe(
            map(() => PVS_CONNECTION_SUCCESS()),
            catchError(() =>
              of({
                type: 'waiting to have a stable connection to the PVS'
              })
            )
          )
        )
      )
    )
  )
}

export default connectToEpic
