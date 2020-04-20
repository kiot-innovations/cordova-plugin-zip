import { pathOr, test } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  takeUntil
} from 'rxjs/operators'
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

const connectToPVS = async (ssid, password) => {
  try {
    if (isIos()) {
      await window.WifiWizard2.iOSConnectNetwork(ssid, password)
    } else {
      //looks like wifiwizard works like this in andrdoid
      // I don't know why (ET)
      await window.WifiWizard2.getConnectedSSID()
      await window.WifiWizard2.connect(ssid, true, password, WPA, false)
    }
  } catch (e) {
    console.info('error connecting to EIFI')
    console.info(e)
    throw new Error(e)
  }
}

const connectToEpic = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_INIT.getType()),
    mergeMap(action => {
      const ssid = pathOr('', ['payload', 'ssid'], action)
      const password = pathOr('', ['payload', 'password'], action)
      return from(connectToPVS(ssid, password)).pipe(
        map(() => WAIT_FOR_SWAGGER()),
        catchError(err => {
          if (hasCode7(err)) {
            return of(STOP_NETWORK_POLLING({ canceled: true }))
          } else {
            return of(PVS_CONNECTION_INIT({ ssid: ssid, password: password }))
          }
        })
      )
    })
  )

export const waitForSwaggerEpic = action$ => {
  const stopPolling$ = action$.pipe(ofType(PVS_CONNECTION_SUCCESS.getType()))

  return action$.pipe(
    ofType(WAIT_FOR_SWAGGER.getType()),
    exhaustMap(() =>
      timer(0, 1000).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() =>
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
