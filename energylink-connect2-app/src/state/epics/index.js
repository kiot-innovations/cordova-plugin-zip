import { combineEpics } from 'redux-observable'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'

export default combineEpics(...networkPollingEpics,discoverDeviceEpic)
