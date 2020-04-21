import { createReducer } from 'redux-act'
import { HIDE_MODAL, SHOW_MODAL } from 'state/actions/modal'

const initialState = {}

const parseModalParametes = modal => ({
  ...modal,
  withButtons: !!modal.okButton
})

const modalReducer = createReducer(
  {
    [SHOW_MODAL]: (state, payload) => ({
      show: true,
      ...parseModalParametes(payload)
    }),
    [HIDE_MODAL]: () => ({})
  },
  initialState
)

export default modalReducer
