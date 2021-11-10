import { combineEpics } from 'redux-observable'

import analyticsEpics from './analytics'
import apisEpic from './api'
import appUpdaterEpics from './appUpdater'
import authEpics from './auth'
import bluetoothEpics from './bluetooth'
import deviceEpics from './devices'
import downloader from './downloader'
import featureFlagsEpics from './feature-flags'
import feedbackEpic from './feedback'
import firmwareUpdateEpics from './fimwareUpdate'
import knowledgeBase from './knowledge-base'
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
import checkSSLCertsEpics from './sslCerts'
import statusMessages from './statusMessages'
import storageEpics from './storage'
import superuserEpics from './superuser'
import systemConfigurationEpics from './systemConfiguration'
import wakelockEpics from './wakelock'

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
  ...knowledgeBase,
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
  ...wakelockEpics,
  ...featureFlagsEpics,
  liveEnergyData
)
