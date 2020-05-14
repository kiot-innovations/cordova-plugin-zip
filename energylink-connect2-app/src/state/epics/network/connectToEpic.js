import allSettled from 'promise.allsettled'
import { compose, find, isEmpty, isNil, pathOr, propEq, test } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, exhaustMap, map, takeUntil } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import { fetchAdamaPVS, isIos } from 'shared/utils'
import {
  PVS_CONNECTION_ERROR,
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING,
  WAIT_FOR_SWAGGER
} from 'state/actions/network'

const WPA = 'WPA'
const hasCode7 = test(/Code=7/)
const isTimeout = test(/CONNECT_FAILED_TIMEOUT/)
const isInvalidNetworkID = test(/INVALID_NETWORK_ID_TO_CONNECT/)
const isWaitingForConnection = test(/WAITING_FOR_CONNECTION/)

const connectToPVS = async (ssid, password) => {
  console.warn('CONNECT TO PVS', { ssid, password })
  try {
    if (isIos()) {
      await window.WifiWizard2.iOSConnectNetwork(ssid, password)
    } else {
      //looks like wifiwizard works like this in andrdoid
      // I don't know why (ET)
      await window.WifiWizard2.getConnectedSSID()
      await window.WifiWizard2.connect(ssid, true, password, WPA, false)
    }
  } catch (err) {
    const normalizedError = err || 'UNKNOWN_ERROR'
    throw new Error(normalizedError)
  }
}

const connectToEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS_CONNECTION_INIT.getType()),
    exhaustMap(action => {
      const ssid = pathOr('', ['payload', 'ssid'], action)
      const password = pathOr('', ['payload', 'password'], action)

      if (!ssid || isEmpty(ssid)) {
        const t = translate(state$.value.language)
        return of(PVS_CONNECTION_ERROR(t('PVS_CONNECTION_EMPTY_SSID')))
      }

      return from(connectToPVS(ssid, password)).pipe(
        map(() => WAIT_FOR_SWAGGER()),
        catchError(err => {
          if (hasCode7(err) || isTimeout(err) || isInvalidNetworkID(err)) {
            return of(STOP_NETWORK_POLLING({ canceled: true }))
          } else {
            return of(WAIT_FOR_SWAGGER())
          }
        })
      )
    })
  )

const parsePromises = compose(Boolean, find(propEq('status', 'fulfilled')))

const checkForConnection = async () => {
  const promises = [getApiPVS(), fetchAdamaPVS('GetSupervisorInformation')]
  const isConnected = parsePromises(await allSettled(promises))
  if (!isConnected) throw new Error('WAITING_FOR_CONNECTION')
}

export const waitForSwaggerEpic = (action$, state$) => {
  const stopPolling$ = action$.pipe(ofType(PVS_CONNECTION_SUCCESS.getType()))
  const t = translate(state$.value.language)

  return action$.pipe(
    ofType(WAIT_FOR_SWAGGER.getType()),
    exhaustMap(() =>
      timer(0, 3000).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() =>
          from(checkForConnection()).pipe(
            map(() => PVS_CONNECTION_SUCCESS()),
            catchError(err => {
              if (
                !isNil(err.message) &&
                !isEmpty(err.message) &&
                !isWaitingForConnection(err.message)
              )
                return of(PVS_CONNECTION_ERROR(t('PVS_CONNECTION_TIMEOUT')))
              return of(
                PVS_CONNECTION_INIT({
                  ssid: state$.value.network.SSID,
                  password: state$.value.network.password
                })
              )
            })
          )
        )
      )
    )
  )
}

export default connectToEpic
