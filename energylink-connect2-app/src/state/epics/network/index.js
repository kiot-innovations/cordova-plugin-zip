import { networkPollingEpic } from './networkEpic'
import connectToEpic from './connectToEpic'

export default [networkPollingEpic, connectToEpic]
