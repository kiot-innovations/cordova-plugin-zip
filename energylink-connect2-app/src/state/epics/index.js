import { combineEpics } from 'redux-observable'
import firmwareUpdates from './fimwareUpdate'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'
import feedbackEpic from './feedback'
import siteEpic from './site'
import pvsEpic from './pvs'

export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  ...feedbackEpic,
  ...firmwareUpdates,
  siteEpic,
  pvsEpic
)
