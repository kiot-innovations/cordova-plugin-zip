import { combineEpics } from 'redux-observable'
import firmwareUpdatesEpics from './fimwareUpdate'
import discoverDeviceEpic from './devices/discoverDevices'
import networkPollingEpics from './network'
import feedbackEpic from './feedback'
import siteEpic from './site'
import pvsEpic from './pvs'
import systemConfigurationEpics from './systemConfiguration'
import liveEnergyData from './live-energy-data'

export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  ...feedbackEpic,
  ...firmwareUpdatesEpics,
  siteEpic,
  pvsEpic,
  ...systemConfigurationEpics,
  liveEnergyData
)
