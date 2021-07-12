import { find, propEq } from 'ramda'
import { ofType } from 'redux-observable'
import { of, EMPTY } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { pvsInternet } from 'shared/analytics'
import { getElapsedTime } from 'shared/utils'
import { RESET_PVS_INTERNET_TRACKING } from 'state/actions/analytics'
import { GET_INTERFACES_SUCCESS } from 'state/actions/systemConfiguration'

const getWiFiInterface = find(propEq('interface', 'sta0'))

const pvsInternetEpic = (action$, state$) =>
  action$.pipe(
    ofType(GET_INTERFACES_SUCCESS.getType()),
    switchMap(({ payload: interfaces }) => {
      const {
        pvsInternetSsid: connectingSsid,
        pvsInternetMode: connectingMode,
        pvsInternetTimer: startTime
      } = state$.value.analytics

      // Only send the Internet Setup event if action CONNECT_NETWORK_AP_INIT was
      // triggered previously
      if (connectingSsid && connectingMode) {
        const wiFiInterface = getWiFiInterface(interfaces)
        const { internet, ssid, status } = wiFiInterface
        const success =
          ssid === connectingSsid && internet === 'up' && status === 'connected'
        const duration = getElapsedTime(startTime)
        let connectionMethod

        switch (connectingMode) {
          case 'psk':
            connectionMethod = 'HO WiFi'
            break
          case 'wps-pbc':
            connectionMethod = 'WPS'
            break
          default:
            connectionMethod = 'Unknown'
            break
        }

        return of(
          pvsInternet({
            connectionMethod,
            success,
            duration
          }),
          RESET_PVS_INTERNET_TRACKING()
        )
      }

      return EMPTY
    })
  )

export default pvsInternetEpic
