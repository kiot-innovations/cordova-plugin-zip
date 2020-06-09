import { ofType } from 'redux-observable'
import { pathOr } from 'ramda'
import { EMPTY, from, of, timer } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING
} from 'state/actions/network'

const fetchSSID = async ssid => {
  const currentSSID = await window.WifiWizard2.getConnectedSSID()
  if (currentSSID !== ssid) throw new Error('NETWORK_NAME_DIFFERENT')
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
        exhaustMap(() => from(fetchSSID(state.network.SSID))),
        map(() => ({ type: 'DEVICE_IS_CONNECTED' })),
        catchError(() =>
          pathOr(
            false,
            ['value', 'fileDownloader', 'progress', 'downloading'],
            state$
          )
            ? EMPTY
            : of(
                PVS_CONNECTION_INIT({
                  ssid: state.network.SSID,
                  password: state.network.password
                })
              )
        )
      )
    )
  )
}
