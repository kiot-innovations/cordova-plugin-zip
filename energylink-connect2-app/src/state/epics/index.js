import { combineEpics } from 'redux-observable'
import firmwareUpdatesEpics from './fimwareUpdate'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'
import feedbackEpic from './feedback'
import siteEpic from './site'
import pvsEpic from './pvs'

export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  ...feedbackEpic,
  ...firmwareUpdatesEpics,
  siteEpic,
  pvsEpic
)
