import { createReducer } from 'redux-act'

import { HIDE_MODAL, SET_CURRENT_MODAL } from 'state/actions/modal'

const initialState = {}

const parseModalParametes = modal => ({
  ...modal,
  withButtons: !!modal.okButton
})

const modalReducer = createReducer(
  {
    [SET_CURRENT_MODAL]: (state, payload) => ({
      show: true,
      ...parseModalParametes(payload)
    }),
    [HIDE_MODAL]: () => ({})
  },
  initialState
)

export default modalReducer
