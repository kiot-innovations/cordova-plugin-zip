import { ofType } from 'redux-observable'
import { switchMap } from 'rxjs/operators'
import { of, EMPTY } from 'rxjs'
import { pvsInternet } from 'shared/analytics'
import { getElapsedTime } from 'shared/utils'
import { SET_ONLINE } from 'state/actions/network'
import { CONNECT_NETWORK_AP_ERROR } from 'state/actions/systemConfiguration'

const pvsInternetEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_ONLINE.getType(), CONNECT_NETWORK_AP_ERROR.getType()),
    switchMap(({ type, payload }) => {
      const { pvsInternetTimer: startTime } = state$.value.analytics
      let duration = getElapsedTime(startTime)
      const { wpsConnectionStatus } = state$.value.systemConfiguration.network

      if (type === CONNECT_NETWORK_AP_ERROR.getType()) {
        const connectionMethod =
          wpsConnectionStatus === 'connecting' ? 'WPS' : 'HO WiFi'

        return of(
          pvsInternet({
            connectionMethod,
            success: false,
            duration
          })
        )
      }

      if (type === SET_ONLINE.getType() && payload) {
        const interfaceUp = payload
        let connectionMethod

        switch (interfaceUp) {
          case 'WiFi':
            connectionMethod =
              wpsConnectionStatus === 'success' ? 'WPS' : 'HO WiFi'
            break
          case 'Ethernet':
            connectionMethod = 'Wired'
            duration = 0
            break
          default:
            connectionMethod = interfaceUp
            duration = 0
            break
        }

        return of(
          pvsInternet({
            connectionMethod,
            success: true,
            duration
          })
        )
      }

      return EMPTY
    })
  )

export default pvsInternetEpic
