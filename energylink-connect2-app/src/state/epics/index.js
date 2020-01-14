import { combineEpics } from 'redux-observable'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'
import pvsEpic from './pvs'

export default combineEpics(...networkPollingEpics, discoverDeviceEpic, pvsEpic)
