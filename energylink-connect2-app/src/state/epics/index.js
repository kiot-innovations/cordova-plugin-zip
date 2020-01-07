import { combineEpics } from 'redux-observable'

// import auth from './auth'
import networkPollingEpic from './network'

export default combineEpics(networkPollingEpic)
