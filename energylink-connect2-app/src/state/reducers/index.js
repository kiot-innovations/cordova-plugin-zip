import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { getReducer as getPLTReducer } from '@sunpower/panel-layout-tool'
import storage from 'redux-persist/lib/storage'

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

import ui from './ui'
import fileDownloader from './fileDownloader'
import devicesReducer from './devices'
import systemConfigurationReducer from './systemConfiguration'
import firmwareUpdate from './firmware-update'

export default combineReducers({
  ...getPLTReducer(),
  ui,
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
  global: globalReducer,
  inventory: inventoryReducer,
  network: networkReducer,
  pvs: pvsReducer,
  site: siteReducer,
  devices: devicesReducer,
  share: shareReducer,
  systemConfiguration: systemConfigurationReducer,
  energyLiveData,
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
  )
  // Add reducers here
})
