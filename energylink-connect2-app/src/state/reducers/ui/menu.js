import {
  MENU_SHOW,
  MENU_HIDE,
  MENU_DISPLAY_ITEM,
  SET_PREVIOUS_URL
} from 'state/actions/ui'

import { createReducer } from 'redux-act'

const initialState = {
  show: false,
  itemToDisplay: '',
  previousURL: ''
}

export default createReducer(
  {
    [MENU_SHOW]: state => ({ ...state, show: true, itemToDisplay: '' }),
    [MENU_HIDE]: state => ({ ...state, show: false, itemToDisplay: '' }),
    [MENU_DISPLAY_ITEM]: (state, itemToDisplay) => ({
      ...state,
      show: true,
      itemToDisplay
    }),
    [SET_PREVIOUS_URL]: (state, previousURL) => ({ ...state, previousURL })
  },
  initialState
)
