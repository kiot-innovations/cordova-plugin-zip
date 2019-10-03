import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { historyReducer } from './history'
import { userReducer } from './user'
import { languageReducer } from './language'
import { alertsReducer } from './alerts'
import { wifiReducer } from './wifi'
import { energyDataReducer } from './energy-data'
import { globalReducer } from './global'
import { storageReducer } from './storage'
import { environmentReducer } from './environment'
import { shareReducer } from './share'
import { migrationsMap, storesVersions } from './migrations'

export default combineReducers({
  history: persistReducer(
    {
      key: 'history',
      storage,
      version: storesVersions.historyReducer
    },
    historyReducer
  ),
  user: persistReducer(
    {
      key: 'user',
      storage,
      version: storesVersions.userReducer,
      blacklist: ['err']
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
  alerts: persistReducer(
    {
      key: 'alerts',
      storage,
      migrate: migrationsMap.alerts,
      version: storesVersions.alertsReducer
    },
    alertsReducer
  ),
  wifi: persistReducer(
    {
      key: 'wifi',
      storage,
      blacklist: ['hasWifiInitialData'],
      version: storesVersions.wifiReducer
    },
    wifiReducer
  ),
  energyData: persistReducer(
    {
      key: 'energyData',
      storage,
      blacklist: ['isLoading'],
      migrate: migrationsMap.energyData,
      version: storesVersions.energyDataReducer
    },
    energyDataReducer
  ),
  storage: persistReducer(
    {
      key: 'storage',
      storage,
      version: storesVersions.storageReducer
    },
    storageReducer
  ),
  environment: persistReducer(
    {
      key: 'environment',
      storage,
      version: storesVersions.environmentReducer
    },
    environmentReducer
  ),
  global: globalReducer,
  share: shareReducer
  // Add reducers here
})
