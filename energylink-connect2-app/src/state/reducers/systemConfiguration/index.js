import { combineReducers } from 'redux'
import { networkReducer } from './network'

export default combineReducers({
  network: networkReducer
})
