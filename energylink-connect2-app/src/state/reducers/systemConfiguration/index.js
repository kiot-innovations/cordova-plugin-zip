import { combineReducers } from 'redux'

import { gridBehaviorReducer } from './gridBehavior'
import { networkReducer } from './network'

export default combineReducers({
  gridBehavior: gridBehaviorReducer,
  network: networkReducer
})
