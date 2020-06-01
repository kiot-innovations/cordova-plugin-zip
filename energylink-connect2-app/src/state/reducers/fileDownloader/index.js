import { combineReducers } from 'redux'
import fileInfo from './info'
import progress from './progress'
import gridProfileInfo from './gridProfileInfo'

export default combineReducers({
  progress,
  fileInfo,
  gridProfileInfo
})
