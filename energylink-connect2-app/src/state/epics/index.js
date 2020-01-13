import { combineEpics } from 'redux-observable'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'
import siteEpic from './site'

export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  siteEpic
)
