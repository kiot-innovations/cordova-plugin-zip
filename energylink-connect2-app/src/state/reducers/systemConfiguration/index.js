import { combineReducers } from 'redux'

import { gridBehaviorReducer } from './gridBehavior'
import { networkReducer } from './network'
import { meterReducer } from './meter'
import { submitConfigReducer } from './submitConfiguration'
import storageReducer from './storage'
import interfacesReducer from './interfaces'

export default combineReducers({
  gridBehavior: gridBehaviorReducer,
  network: networkReducer,
  meter: meterReducer,
  submit: submitConfigReducer,
  storage: storageReducer,
  interfaces: interfacesReducer
})
