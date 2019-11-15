import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { userReducer } from './user'

import { languageReducer } from './language'
import { globalReducer } from './global'
import { storesVersions } from './migrations'
import ui from './ui'

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

  global: globalReducer
  // Add reducers here
})
