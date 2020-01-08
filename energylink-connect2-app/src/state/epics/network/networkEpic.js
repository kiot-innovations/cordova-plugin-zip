import { ofType } from 'redux-observable'
import { from, timer } from 'rxjs'
import { switchMap, takeUntil } from 'rxjs/operators'
import {
  STOP_NETWORK_POLLING,
  PVS_CONNECTION_SUCCESS,
  PVS_CONNECTION_INIT
} from 'state/actions/network'

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
            switchMap(async currentSSID => {
              if (!currentSSID)
                return PVS_CONNECTION_INIT({
                  ssid: state$.network.SSID,
                  password: state$.network.password
                })
            })
          )
        )
      )
    )
  )
}
