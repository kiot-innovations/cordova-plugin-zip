import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import fileInfo from './info'
import progress from './progress'
import pvs6GridProfileInfo from './pvs6GridProfileInfo'
import pvs5GridProfileInfo from './pvs5GridProfileInfo'
import settings from './downloadSettings'
import verification from './verification'

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
  pvs6GridProfileInfo,
  pvs5GridProfileInfo,
  settings,
  verification
})
