import { combineEpics } from 'redux-observable'

import analyticsEpics from './analytics'
import appUpdaterEpics from './appUpdater'
import authEpics from './auth'
import deviceEpics from './devices'
import downloader from './downloader'
import feedbackEpic from './feedback'
import firmwareUpdateEpics from './fimwareUpdate'
import liveEnergyData from './live-energy-data'
import modalEpics from './modals/showModal'
import networkPollingEpics from './network'
import panelLayoutToolEpics from './panel-layout-tool'
import pvsEpics from './pvs'
import rmaEpics from './rma'
import bluetoothEpics from './bluetooth'
import scanditEpics from './scandit'
import siteEpics from './site'
import storageEpics from './storage'
import systemConfigurationEpics from './systemConfiguration'

export default combineEpics(
  ...modalEpics,
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
  ...rmaEpics,
  ...appUpdaterEpics,
  ...analyticsEpics,
  ...bluetoothEpics
)
