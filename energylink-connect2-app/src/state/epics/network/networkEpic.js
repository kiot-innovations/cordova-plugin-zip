import { from, timer } from 'rxjs'
import { ofType } from 'redux-observable'
import {
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING,
  connectTo
} from '../../actions/network'
import { takeUntil, switchMap } from 'rxjs/operators'

const fetchSSID = () => window.WifiWizard2.getConnectedSSID()

export const networkPollingEpic = (action$, state$) => {
  const stopPolling$ = action$.pipe(ofType(STOP_NETWORK_POLLING.getType()))
  return action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    switchMap(() =>
      timer(0, 3000).pipe(
        takeUntil(stopPolling$),
        switchMap(() =>
          from(fetchSSID()).pipe(
            switchMap(currentSSID => {
              if (!currentSSID)
                connectTo(state$.network.SSID, state$.network.password)
            })
          )
        )
      )
    )
  )
}
