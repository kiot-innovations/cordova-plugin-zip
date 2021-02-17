import { createReducer } from 'redux-act'
import {
  CHECK_LOCATION_PERMISSION_INIT,
  CHECK_LOCATION_PERMISSION_SUCCESS,
  CHECK_LOCATION_PERMISSION_ERROR
} from 'state/actions/permissions'
import { SHOW_MODAL, HIDE_MODAL } from 'state/actions/modal'

export const LOCATION_PERMISSIONS = {
  DENIED_ONCE: 'DENIED_ONCE',
  DENIED_ALWAYS: 'DENIED_ALWAYS',
  NOT_REQUESTED: 'NOT_REQUESTED',
  WHILE_IN_USE: 'authorized_when_in_use'
}

const initialState = {
  location: null,
  error: null,
  modalOpened: false
}

export default createReducer(
  {
    [CHECK_LOCATION_PERMISSION_INIT]: () => initialState,
    [CHECK_LOCATION_PERMISSION_SUCCESS]: (state, location) => ({
      ...state,
      location
    }),
    [CHECK_LOCATION_PERMISSION_ERROR]: (state, error) => ({
      ...state,
      location: null,
      error
    }),
    [SHOW_MODAL]: state => ({
      ...state,
      modalOpened: true
    }),
    [HIDE_MODAL]: state => ({
      ...state,
      modalOpened: false
    })
  },
  initialState
)
