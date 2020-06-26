import { networkPollingEpic } from './networkEpic'
import connectToEpic, { waitForSwaggerEpic } from './connectToEpic'
import disconnectFromEpic from './disconnectFromEpic'

export default [
  networkPollingEpic,
  connectToEpic,
  waitForSwaggerEpic,
  disconnectFromEpic
]
