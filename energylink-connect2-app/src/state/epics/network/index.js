import { connectionStateListenerEpic } from './connectionStateListener'
import connectToEpic, {
  waitForSwaggerEpic,
  pvsTimeoutForConnectionEpic
} from './connectToEpic'
import disconnectFromEpic from './disconnectFromEpic'
import { networkPollingEpic } from './networkEpic'
import { statusWifiRetryEpic, statusWifiEpic } from './statusWifiEpic'

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
