import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { userReducer } from './user'
import { inventoryReducer } from './inventory'
import { languageReducer } from './language'
import { networkReducer } from './network'
import { pvsReducer } from './pvs'
import { globalReducer } from './global'
import { storesVersions } from './migrations'
import ui from './ui'
import fileDownloader from './fileDownloader'
import devicesReducer from './devices'

export default combineReducers({
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
  global: globalReducer,
  inventory: inventoryReducer,
  network: networkReducer,
  pvs: pvsReducer,
  devices: devicesReducer
  // Add reducers here
})
