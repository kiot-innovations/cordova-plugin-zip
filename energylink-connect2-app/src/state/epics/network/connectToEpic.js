import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { mergeMap } from 'rxjs/operators'
import {
  PVS_CONNECTION_INIT,
  PVS_CONNECTION_SUCCESS,
  STOP_NETWORK_POLLING
} from 'state/actions/network'

const IOS = 'iOS'
const WPA = 'WPA'
const CODE7 = 'Code=7'

const connectToEpic = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_INIT.getType()),
    mergeMap(async action => {
      const ssid = pathOr('', ['payload', 'ssid'], action)
      const password = pathOr('', ['payload', 'password'], action)
      try {
        if (window.device.platform === IOS) {
          await window.WifiWizard2.iOSConnectNetwork(ssid, password)
        } else {
          await window.WifiWizard2.connect(ssid, true, password, WPA, false)
        }
        return PVS_CONNECTION_SUCCESS()
      } catch (err) {
        if (err.includes(CODE7)) {
          return STOP_NETWORK_POLLING()
        } else {
          return PVS_CONNECTION_INIT({ ssid: ssid, password: password })
        }
      }
    })
  )

export default connectToEpic
