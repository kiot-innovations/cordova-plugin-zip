import { combineReducers } from 'redux'
import fileInfo from './info'
import progress from './progress'
import gridProfileProgress from './gridProfileProgress'

export default combineReducers({
  progress,
  fileInfo,
  gridProfileProgress
})
