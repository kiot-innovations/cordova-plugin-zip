import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import fileInfo from './info'
import progress from './progress'
import gridProfileInfo from './gridProfileInfo'
import settings from './downloadSettings'

export default combineReducers({
  progress,
  fileInfo: persistReducer(
    {
      key: 'file-info',
      whitelist: ['updateURL'],
      storage
    },
    fileInfo
  ),
  gridProfileInfo,
  settings
})
