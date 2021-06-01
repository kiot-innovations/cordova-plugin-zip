import { combineEpics } from 'redux-observable'

import analyticsEpics from './analytics'
import appUpdaterEpics from './appUpdater'
import authEpics from './auth'
import bluetoothEpics from './bluetooth'
import checkSSLCertsEpics from './sslCerts'
import deviceEpics from './devices'
import downloader from './downloader'
import feedbackEpic from './feedback'
import firmwareUpdateEpics from './fimwareUpdate'
import liveEnergyData from './live-energy-data'
import modalEpics from './modals/showModal'
import networkPollingEpics from './network'
import panelLayoutToolEpics from './panel-layout-tool'
import permissionsEpics from './permissions'
import pvsEpics from './pvs'
import rmaEpics from './rma'
import scanditEpics from './scandit'
import sentryEpics from './sentry'
import siteEpics from './site'
import storageEpics from './storage'
import systemConfigurationEpics from './systemConfiguration'
import superuserEpics from './superuser'
import apisEpic from './api'
import statusMessages from './statusMessages'

export default combineEpics(
  ...analyticsEpics,
  ...apisEpic,
  ...appUpdaterEpics,
  ...authEpics,
  ...bluetoothEpics,
  ...checkSSLCertsEpics,
  ...deviceEpics,
  ...downloader,
  ...feedbackEpic,
  ...firmwareUpdateEpics,
  ...modalEpics,
  ...networkPollingEpics,
  ...panelLayoutToolEpics,
  ...permissionsEpics,
  ...pvsEpics,
  ...rmaEpics,
  ...scanditEpics,
  ...sentryEpics,
  ...siteEpics,
  ...statusMessages,
  ...storageEpics,
  ...superuserEpics,
  ...systemConfigurationEpics,
  liveEnergyData
)
