import { networkPollingEpic } from './networkEpic'
import connectToEpic, {
  waitForSwaggerEpic,
  pvsTimeoutForConnectionEpic
} from './connectToEpic'
import disconnectFromEpic from './disconnectFromEpic'

export default [
  networkPollingEpic,
  connectToEpic,
  waitForSwaggerEpic,
  disconnectFromEpic,
  pvsTimeoutForConnectionEpic
]
