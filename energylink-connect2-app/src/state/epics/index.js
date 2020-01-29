import { combineEpics } from 'redux-observable'
import firmwareUpdate from 'state/epics/fimwareUpdate/firmwareUpdate'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'
import feedbackEpic from './feedback'
import siteEpic from './site'
import pvsEpic from './pvs'
import systemConfigurationEpics from './systemConfiguration'
export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  ...feedbackEpic,
  firmwareUpdate,
  siteEpic,
  pvsEpic,
  ...systemConfigurationEpics
)
