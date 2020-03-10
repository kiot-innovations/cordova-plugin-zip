import { ofType } from 'redux-observable'
import { from, timer, of } from 'rxjs'
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
        exhaustMap(() => from(fetchSSID())),
        map(() => ({ type: 'DEVICE_IS_CONNECTED' })),
        catchError(() =>
          of(
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
