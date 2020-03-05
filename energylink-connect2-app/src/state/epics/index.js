import { combineEpics } from 'redux-observable'
import networkPollingEpics from './network'
import feedbackEpic from './feedback'
import siteEpic from './site'
import pvsEpics from './pvs'
import deviceEpics from './devices'
import systemConfigurationEpics from './systemConfiguration'
import liveEnergyData from './live-energy-data'
import authEpics from './auth'
import firmwareUpdateEpics from './fimwareUpdate'

export default combineEpics(
  ...firmwareUpdateEpics,
  ...networkPollingEpics,
  ...feedbackEpic,
  siteEpic,
  ...pvsEpics,
  ...deviceEpics,
  ...systemConfigurationEpics,
  liveEnergyData,
  ...authEpics
)
