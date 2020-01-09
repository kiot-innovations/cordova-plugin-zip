import { combineEpics } from 'redux-observable'

// import auth from './auth'
import site from './site'

export default combineEpics(...[...site])
