import { combineReducers } from 'redux'

import { gridBehaviorReducer } from './gridBehavior'
import { networkReducer } from './network'
import { meterReducer } from './meter'

export default combineReducers({
  gridBehavior: gridBehaviorReducer,
  network: networkReducer
  meter: meterReducer
})
