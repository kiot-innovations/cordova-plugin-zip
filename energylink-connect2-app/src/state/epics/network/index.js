import { networkPollingEpic } from './networkEpic'
import connectToEpic, { waitForSwaggerEpic } from './connectToEpic'

export default [networkPollingEpic, connectToEpic, waitForSwaggerEpic]
