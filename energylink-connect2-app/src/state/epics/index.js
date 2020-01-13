import { combineEpics } from 'redux-observable'
import firmwareUpdate from 'state/epics/fimwareUpdate/firmwareUpdate'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'

export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  firmwareUpdate
)
