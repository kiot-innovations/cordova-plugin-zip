import { includes, pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { EMPTY, from, of, timer } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators'

import {
  PVS_CONNECTION_SUCCESS,
  SET_CONNECTION_STATUS,
  STOP_NETWORK_POLLING
} from 'state/actions/network'
import { EMPTY_ACTION } from 'state/actions/share'
import { appConnectionStatus } from 'state/reducers/network'

const fetchSSID = async ssid => {
  const connectedInterface = window.navigator.connection.type
  if (includes(connectedInterface, ['wifi', 'none'])) {
    try {
      const currentSSID = await window.WifiWizard2.getConnectedSSID()
      if (currentSSID !== ssid) return appConnectionStatus.NOT_CONNECTED_PVS
    } catch {
      return appConnectionStatus.NOT_CONNECTED_PVS
    }
  } else {
    return appConnectionStatus.NOT_USING_WIFI
  }
  return appConnectionStatus.CONNECTED
}

// After a successful connection to the PVS WiFi, check every second if the app
// is still connected to it. If the app isn't connected, then try to reconnect
// it. Stop monitoring if the STOP_NETWORK_POLLING action is dispatched.
export const networkPollingEpic = (action$, state$) => {
  const stopPolling$ = action$.pipe(ofType(STOP_NETWORK_POLLING.getType()))
  let state
  state$.subscribe(s => {
    state = s
  })
  return action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() =>
          from(fetchSSID(state.network.SSID)).pipe(
            map(result => {
              return state.network.connectionStatus !== result
                ? SET_CONNECTION_STATUS(result)
                : EMPTY_ACTION()
            }),
            catchError(() =>
              pathOr(
                false,
                ['value', 'fileDownloader', 'progress', 'downloading'],
                state$
              )
                ? EMPTY
                : of(
                    SET_CONNECTION_STATUS(appConnectionStatus.NOT_CONNECTED_PVS)
                  )
            )
          )
        )
      )
    )
  )
}
