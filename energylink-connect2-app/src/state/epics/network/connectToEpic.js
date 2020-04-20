import { pathOr, test, isEmpty } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  takeUntil,
  timeout,
  race,
  switchMap
} from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { isIos } from 'shared/utils'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING,
  WAIT_FOR_SWAGGER,
  PVS_CONNECTION_ERROR
} from 'state/actions/network'
import { translate } from 'shared/i18n'

const WPA = 'WPA'
const hasCode7 = test(/Code=7/)
const isTimeout = test(/CONNECT_FAILED_TIMEOUT/)

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
    throw new Error(e)
  }
}

const connectToEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS_CONNECTION_INIT.getType()),
    switchMap(action => {
      const ssid = pathOr('', ['payload', 'ssid'], action)
      const password = pathOr('', ['payload', 'password'], action)

      if (!ssid || isEmpty(ssid)) {
        const t = translate(state$.value.language)
        return of(PVS_CONNECTION_ERROR(t('PVS_CONNECTION_EMPTY_SSID')))
      }

      return from(connectToPVS(ssid, password)).pipe(
        map(() => WAIT_FOR_SWAGGER()),
        catchError(err => {
          if (hasCode7(err) || isTimeout(err)) {
            return of(STOP_NETWORK_POLLING({ canceled: true }))
          } else {
            return of(PVS_CONNECTION_INIT({ ssid: ssid, password: password }))
          }
        })
      )
    })
  )

export const waitForSwaggerEpic = (action$, state$) => {
  const stopPolling$ = action$.pipe(ofType(PVS_CONNECTION_SUCCESS.getType()))
  const t = translate(state$.value.language)

  return action$.pipe(
    ofType(WAIT_FOR_SWAGGER.getType()),
    exhaustMap(() =>
      timer(0, 1000).pipe(
        takeUntil(race(stopPolling$, timeout(60 * 1000))),
        exhaustMap(() =>
          from(getApiPVS()).pipe(
            map(() => PVS_CONNECTION_SUCCESS()),
            catchError(() =>
              of(PVS_CONNECTION_ERROR(t('PVS_CONNECTION_TIMEOUT')))
            )
          )
        )
      )
    )
  )
}

export default connectToEpic
