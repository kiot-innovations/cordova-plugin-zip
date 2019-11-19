import { combineReducers } from 'redux'
import header from './header.reducer'
import footer from './footer.reducer'

export default combineReducers({
  header,
  footer
})
