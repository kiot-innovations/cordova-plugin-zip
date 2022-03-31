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
import firmwareUpdateEpics from './firmwareUpdate'
import knowledgeBase from './knowledgeBase'
import liveEnergyData from './live-energy-data'
import mobile from './mobile'
import modalEpics from './modals/showModal'
import networkPollingEpics from './network'
import panelLayoutToolEpics from './panel-layout-tool'
import pcsEpics from './pcs'
import permissionsEpics from './permissions'
import pvsEpics from './pvs'
import releaseNotesEpics from './releaseNotes'
import rmaEpics from './rma'
import scanditEpics from './scandit'
import sentryEpics from './sentry'
import siteEpics from './site'
import checkSSLCertsEpics from './sslCerts'
import statusMessages from './statusMessages'
import storageEpics from './storage'
import superuserEpics from './superuser'
import systemChecksEpics from './systemChecks'
import systemConfigurationEpics from './systemConfiguration'
import wakelockEpics from './wakelock'

export default combineEpics(
  ...mobile,
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
  ...releaseNotesEpics,
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
  ...systemChecksEpics,
  ...pcsEpics,
  liveEnergyData
)
