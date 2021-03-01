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
  delayWhen
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
  SET_CONNECTION_STATUS
} from 'state/actions/network'
import { EMPTY_ACTION } from 'state/actions/share'
import { appConnectionStatus } from 'state/reducers/network'

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
          const { message } = err
          const isTimeoutAndNotUpgrading =
            isTimeout(message) &&
            state$.value.firmwareUpdate.status !== 'UPGRADE_COMPLETE'

          if (
            hasCode7(message) ||
            isInvalidNetworkID(message) ||
            isInterrupted(message) ||
            isWIFIDisabled(message) ||
            isNetworkUnavailable(message) ||
            isTimeoutAndNotUpgrading
          ) {
            console.error(message)
            return of(
              SET_CONNECTION_STATUS(appConnectionStatus.NOT_CONNECTED_PVS)
            )
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
                return of(
                  PVS_CONNECTION_ERROR(t('PVS_CONNECTION_TIMEOUT')),
                  SET_CONNECTION_STATUS(appConnectionStatus.NOT_CONNECTED_PVS)
                )
              return state$.value.fileDownloader.progress.downloading
                ? EMPTY
                : of(
                    SET_CONNECTION_STATUS(appConnectionStatus.NOT_CONNECTED_PVS)
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
        : PVS_CONNECTION_ERROR('PVS_CONNECTION_TIMEOUT')
    ),
    catchError(error => {
      Sentry.captureException(error)
      return of(EMPTY_ACTION())
    })
  )

export default connectToEpic
