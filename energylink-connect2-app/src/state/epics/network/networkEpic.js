import { ofType } from 'redux-observable'
import { from, timer } from 'rxjs'
import { catchError, switchMap, takeUntil, map } from 'rxjs/operators'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING
} from 'state/actions/network'

const fetchSSID = () => window.WifiWizard2.getConnectedSSID()

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
        switchMap(() => from(fetchSSID())),
        map(() => {
          return { type: 'DEVICE_IS_CONNECTED' }
        }),
        catchError(async () => {
          return PVS_CONNECTION_INIT({
            ssid: state.network.SSID,
            password: state.network.password
          })
        })
      )
    )
  )
}
