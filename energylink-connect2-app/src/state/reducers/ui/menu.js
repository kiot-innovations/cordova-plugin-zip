import { MENU_DISPLAY_ITEM, MENU_HIDE, MENU_SHOW } from 'state/actions/ui'

import { createReducer } from 'redux-act'

const initialState = {
  show: false,
  itemToDisplay: ''
}

export default createReducer(
  {
    [MENU_SHOW]: state => ({ ...state, show: true, itemToDisplay: '' }),
    [MENU_HIDE]: state => ({ ...state, show: false, itemToDisplay: '' }),
    [MENU_DISPLAY_ITEM]: (state, itemToDisplay) => ({
      ...state,
      show: true,
      itemToDisplay
    })
  },
  initialState
)
