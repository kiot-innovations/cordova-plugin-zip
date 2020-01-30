import { combineReducers } from 'redux'
import { networkReducer } from './network'
import { meterReducer } from './meter'

export default combineReducers({
  network: networkReducer,
  meter: meterReducer
})
