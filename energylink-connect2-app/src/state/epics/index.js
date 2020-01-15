import { combineEpics } from 'redux-observable'
import firmwareUpdate from 'state/epics/fimwareUpdate/firmwareUpdate'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'
import siteEpic from './site'

export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  siteEpic,
  firmwareUpdate
)
