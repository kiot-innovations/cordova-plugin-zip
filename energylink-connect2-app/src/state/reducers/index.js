import { getReducer as getPLTReducer } from '@sunpower/panel-layout-tool'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import analyticsReducer from './analytics'
import devicesReducer from './devices'
import { energyDataReducer } from './energy-data'
import { energyLiveData } from './energy-live-data'
import essReducer from './ess'
import fileDownloader from './fileDownloader'
import firmwareUpdate from './firmware-update'
import { globalReducer } from './global'
import { inventoryReducer } from './inventory'
import { languageReducer } from './language'
import { storesVersions } from './migrations'
import modal from './modal'
import { networkReducer } from './network'
import permissionsReducer from './permissions'
import { pltWizard } from './plt-wizard'
import { pvsReducer } from './pvs'
import sentryReducer from './sentry'
import { shareReducer } from './share'
import { siteReducer } from './site'
import { storageReducer } from './storage'
import stringInverters from './stringInverters'
import { superuserReducer } from './superuser'
import systemConfigurationReducer from './systemConfiguration'
import ui from './ui'
import { userReducer } from './user'

import RMAReducer from 'state/reducers/rma'

export default combineReducers({
  ...getPLTReducer(),
  ui,
  superuser: persistReducer(
    {
      key: 'superuser',
      storage
    },
    superuserReducer
  ),
  analytics: persistReducer(
    {
      key: 'analytics',
      blacklist: ['claimingTime', 'claimingDevices'],
      storage
    },
    analyticsReducer
  ),
  user: persistReducer(
    {
      key: 'user',
      storage,
      version: storesVersions.userReducer,
      blacklist: ['err', 'isAuthenticating']
    },
    userReducer
  ),
  language: persistReducer(
    {
      key: 'language',
      storage,
      version: storesVersions.languageReducer
    },
    languageReducer
  ),
  fileDownloader,
  stringInverters,
  firmwareUpdate,
  global: persistReducer(
    {
      key: 'global',
      storage,
      version: storesVersions.globalReducer,
      whitelist: ['showPrecommissioningChecklist']
    },
    globalReducer
  ),
  inventory: inventoryReducer,
  network: networkReducer,
  pvs: pvsReducer,
  rma: RMAReducer,
  site: persistReducer(
    {
      key: 'site',
      blacklist: ['homeownerCreation'],
      storage
    },
    siteReducer
  ),
  devices: devicesReducer,
  share: shareReducer,
  systemConfiguration: systemConfigurationReducer,
  storage: storageReducer,
  energyLiveData,
  modal,
  pltWizard,
  sentry: persistReducer(
    {
      key: 'sentry',
      storage
    },
    sentryReducer
  ),
  energyData: persistReducer(
    {
      key: 'energyData',
      storage,
      blacklist: [
        'isLoading',
        'isLoadingPower',
        'isPolling',
        'isPollingPower',
        'isPollingCurrentPower',
        'isPollingLTD',
        'currentPower'
      ],
      version: storesVersions.energyDataReducer
    },
    energyDataReducer
  ),
  ess: persistReducer(
    {
      key: 'ess',
      storage
    },
    essReducer
  ),
  permissions: permissionsReducer
  // Add reducers here
})
