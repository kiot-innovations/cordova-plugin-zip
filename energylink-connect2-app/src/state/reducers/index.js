import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { getReducer as getPLTReducer } from '@sunpower/panel-layout-tool'
import storage from 'redux-persist/lib/storage'
import modal from './modal'
import { userReducer } from './user'
import { inventoryReducer } from './inventory'
import { languageReducer } from './language'
import { networkReducer } from './network'
import { pvsReducer } from './pvs'
import { globalReducer } from './global'
import { storesVersions } from './migrations'
import { siteReducer } from './site'
import { shareReducer } from './share'
import { energyDataReducer } from './energy-data'
import { energyLiveData } from './energy-live-data'
import { storageReducer } from './storage'
import { pltWizard } from './plt-wizard'
import { superuserReducer } from './superuser'

import ui from './ui'
import fileDownloader from './fileDownloader'
import devicesReducer from './devices'
import systemConfigurationReducer from './systemConfiguration'
import firmwareUpdate from './firmware-update'
import essReducer from './ess'
import RMAReducer from 'state/reducers/rma'
import analyticsReducer from './analytics'
import sentryReducer from './sentry'
import permissionsReducer from './permissions'

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
  devices: persistReducer(
    {
      key: 'devices',
      storage,
      whitelist: ['miModels']
    },
    devicesReducer
  ),
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
