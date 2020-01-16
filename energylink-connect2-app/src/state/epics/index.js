import { combineEpics } from 'redux-observable'
import firmwareUpdate from 'state/epics/fimwareUpdate/firmwareUpdate'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'
import siteEpic from './site'
import pvsEpic from './pvs'

export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  firmwareUpdate,
  siteEpic,
  pvsEpic
)
