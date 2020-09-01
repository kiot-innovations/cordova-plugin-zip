import { combineEpics } from 'redux-observable'
import networkPollingEpics from './network'
import feedbackEpic from './feedback'
import siteEpics from './site'
import pvsEpics from './pvs'
import deviceEpics from './devices'
import systemConfigurationEpics from './systemConfiguration'
import liveEnergyData from './live-energy-data'
import authEpics from './auth'
import firmwareUpdateEpics from './fimwareUpdate'
import downloader from './downloader'
import panelLayoutToolEpics from './panel-layout-tool'
import storageEpics from './storage'
import scanditEpics from './scandit'
import rmaEpics from './rma'

export default combineEpics(
  ...downloader,
  ...firmwareUpdateEpics,
  ...networkPollingEpics,
  ...feedbackEpic,
  ...siteEpics,
  ...pvsEpics,
  ...deviceEpics,
  ...systemConfigurationEpics,
  liveEnergyData,
  ...authEpics,
  ...panelLayoutToolEpics,
  ...storageEpics,
  ...scanditEpics,
  ...rmaEpics
)
