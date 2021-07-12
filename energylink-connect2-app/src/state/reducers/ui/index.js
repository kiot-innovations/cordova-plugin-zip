import { combineReducers } from 'redux'

import footer from './footer.reducer'
import header from './header.reducer'
import menu from './menu'

export default combineReducers({
  header,
  footer,
  menu
})
