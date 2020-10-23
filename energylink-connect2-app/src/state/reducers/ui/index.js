import { combineReducers } from 'redux'
import header from './header.reducer'
import footer from './footer.reducer'
import menu from './menu'

export default combineReducers({
  header,
  footer,
  menu
})
