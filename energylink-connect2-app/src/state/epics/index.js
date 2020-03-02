import { combineEpics } from 'redux-observable'
import discoverDeviceEpic from './devices/discoverDevices'
import pushCandidatesEpic from './devices/pushCandidates'
import fetchCandidatesEpic from './devices/pollCandidates'
import claimDevicesEpic from './devices/claimDevices'
import networkPollingEpics from './network'
import feedbackEpic from './feedback'
import siteEpic from './site'
import pvsEpics from './pvs'
import systemConfigurationEpics from './systemConfiguration'
import liveEnergyData from './live-energy-data'
import authEpics from './auth'

export default combineEpics(
  ...networkPollingEpics,
  discoverDeviceEpic,
  pushCandidatesEpic,
  fetchCandidatesEpic,
  claimDevicesEpic,
  ...feedbackEpic,
  siteEpic,
  ...pvsEpics,
  ...systemConfigurationEpics,
  liveEnergyData,
  ...authEpics
)
