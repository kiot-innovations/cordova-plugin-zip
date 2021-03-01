import { networkPollingEpic } from './networkEpic'
import connectToEpic, {
  waitForSwaggerEpic,
  pvsTimeoutForConnectionEpic
} from './connectToEpic'
import disconnectFromEpic from './disconnectFromEpic'
import { statusWifiRetryEpic, statusWifiEpic } from './statusWifiEpic'
import { connectionStateListenerEpic } from './connectionStateListener'

export default [
  networkPollingEpic,
  connectToEpic,
  waitForSwaggerEpic,
  disconnectFromEpic,
  pvsTimeoutForConnectionEpic,
  statusWifiEpic,
  statusWifiRetryEpic,
  connectionStateListenerEpic
]
