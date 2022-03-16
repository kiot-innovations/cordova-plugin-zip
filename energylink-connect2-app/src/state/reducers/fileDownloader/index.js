import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import settings from './downloadSettings'
import fileInfo from './info'
import progress from './progress'
import pvs5Fw from './pvs5Fw'
import pvs5GridProfileInfo from './pvs5GridProfileInfo'
import pvs5Kernel from './pvs5Kernel'
import pvs5Scripts from './pvs5Scripts'
import pvs6GridProfileInfo from './pvs6GridProfileInfo'
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
  pvs5Fw: persistReducer(
    {
      key: 'pvs5-file-info',
      whitelist: ['updateURL'],
      storage
    },
    pvs5Fw
  ),
  pvs5Scripts: persistReducer(
    {
      key: 'pvs5-scripts-info',
      whitelist: ['updateURL'],
      storage
    },
    pvs5Scripts
  ),
  pvs5Kernel: persistReducer(
    {
      key: 'pvs5-kernel-info',
      whitelist: ['updateURL'],
      storage
    },
    pvs5Kernel
  ),
  pvs6GridProfileInfo,
  pvs5GridProfileInfo,
  settings,
  verification
})
