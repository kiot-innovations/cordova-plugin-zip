import { combineReducers } from 'redux'
import fileInfo from './info'
import progress from './progress'

export default combineReducers({
  progress,
  fileInfo
})
