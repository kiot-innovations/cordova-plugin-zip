import * as Sentry from '@sentry/browser'
import allSettled from 'promise.allsettled'
import {
  compose,
  find,
  isEmpty,
  isNil,
  pathOr,
  propEq,
  test,
  always,
  path
} from 'ramda'
import { ofType } from 'redux-observable'
import { EMPTY, from, of, timer } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  takeUntil,
  delayWhen,
  mergeMap
} from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import { sendCommandToPVS } from 'shared/PVSUtils'
import { isIos } from 'shared/utils'
import {
  PVS_CONNECTION_ERROR,
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING,
  WAIT_FOR_SWAGGER,
  PVS_TIMEOUT_FOR_CONNECTION,
  ENABLE_ACCESS_POINT
} from 'state/actions/network'
import { EMPTY_ACTION } from 'state/actions/share'
import { BLESTATUS } from 'state/reducers/network'
import paths from 'routes/paths'

const WPA = 'WPA'
const hasCode7 = test(/Code=7/)
const isTimeout = test(/CONNECT_FAILED_TIMEOUT/)
const isInvalidNetworkID = test(/INVALID_NETWORK_ID_TO_CONNECT/)
const isNetworkUnavailable = test(/ERROR_REQUESTED_NETWORK_UNAVAILABLE/)
const isInterrupted = test(/INTERPUT_EXCEPT_WHILE_CONNECTING/)
const isWIFIDisabled = test(/WIFI_NOT_ENABLED/)
const isWaitingForConnection = test(/WAITING_FOR_CONNECTION/)

const connectToPVS = async (ssid, password) => {
  try {
    if (isIos()) {
      await window.WifiWizard2.iOSConnectNetwork(ssid, password)
    } else {
      //looks like wifiwizard works like this in andrdoid
      // I don't know why (ET)
      await window.WifiWizard2.connect(ssid, false, password, WPA, false)
    }
  } catch (err) {
    const normalizedError = err || 'UNKNOWN_ERROR'
    throw new Error(normalizedError)
  }
}

const connectToEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS_CONNECTION_INIT.getType()),
    mergeMap(action => {
      const ssid = pathOr('', ['payload', 'ssid'], action)
      const password = pathOr('', ['payload', 'password'], action)

      if (!ssid || isEmpty(ssid)) {
        const t = translate(state$.value.language)
        return of(PVS_CONNECTION_ERROR(t('PVS_CONNECTION_EMPTY_SSID')))
      }

      return from(connectToPVS(ssid, password)).pipe(
        map(() => WAIT_FOR_SWAGGER()),
        catchError(err => {
          const isTimeoutAndNotUpgrading =
            isTimeout(err) &&
            state$.value.firmwareUpdate.status !== 'UPGRADE_COMPLETE'

          const wasUsingBLE =
            isNetworkUnavailable(err) &&
            state$.value.network.bluetoothStatus ===
              BLESTATUS.ENABLED_ACCESS_POINT_ON_PVS &&
            window.location.hash.split('#')[1] ===
              paths.PROTECTED.CONNECT_TO_PVS.path

          if (
            hasCode7(err) ||
            isInvalidNetworkID(err) ||
            isInterrupted(err) ||
            isWIFIDisabled(err) ||
            isTimeoutAndNotUpgrading ||
            !wasUsingBLE
          ) {
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
  const promises = [getApiPVS(), sendCommandToPVS('GetSupervisorInformation')]
  const isConnected = parsePromises(await allSettled(promises))
  if (!isConnected) throw new Error('WAITING_FOR_CONNECTION')
}

export const waitForSwaggerEpic = (action$, state$) => {
  const stopPolling$ = action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType(), STOP_NETWORK_POLLING.getType())
  )

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
              return state$.value.fileDownloader.progress.downloading
                ? EMPTY
                : of(
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

export const pvsTimeoutForConnectionEpic = (action$, state$) =>
  action$.pipe(
    ofType(PVS_TIMEOUT_FOR_CONNECTION.getType()),
    map(always(15 * 1000)),
    delayWhen(timer),
    map(() =>
      path(['value', 'network', 'connected'], state$)
        ? EMPTY_ACTION()
        : ENABLE_ACCESS_POINT()
    ),
    catchError(error => {
      Sentry.captureException(error)
      return of(EMPTY_ACTION())
    })
  )

export default connectToEpic
