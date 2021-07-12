import { combineReducers } from 'redux'

import { gridBehaviorReducer } from './gridBehavior'
import interfacesReducer from './interfaces'
import { meterReducer } from './meter'
import { networkReducer } from './network'
import rseReducer from './rse'
import storageReducer from './storage'
import { submitConfigReducer } from './submitConfiguration'

export default combineReducers({
  gridBehavior: gridBehaviorReducer,
  network: networkReducer,
  meter: meterReducer,
  submit: submitConfigReducer,
  storage: storageReducer,
  interfaces: interfacesReducer,
  rse: rseReducer
})
