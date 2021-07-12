import { createReducer } from 'redux-act'

import { SHOW_MODAL, HIDE_MODAL } from 'state/actions/modal'
import {
  CHECK_LOCATION_PERMISSION_INIT,
  CHECK_LOCATION_PERMISSION_SUCCESS,
  CHECK_LOCATION_PERMISSION_ERROR,
  SET_TRACKING_PERMISSION
} from 'state/actions/permissions'

export const trackingPermissionValues = {
  TRACKING_PERMISSION_NOT_DETERMINED: 0,
  TRACKING_PERMISSION_RESTRICTED: 1,
  TRACKING_PERMISSION_DENIED: 2,
  TRACKING_PERMISSION_AUTHORIZED: 3
}

export const LOCATION_PERMISSIONS = {
  DENIED_ONCE: 'DENIED_ONCE',
  DENIED_ALWAYS: 'DENIED_ALWAYS',
  NOT_REQUESTED: 'NOT_REQUESTED',
  WHILE_IN_USE: 'authorized_when_in_use'
}

const initialState = {
  location: null,
  error: null,
  modalOpened: false,
  trackingPermission:
    trackingPermissionValues.TRACKING_PERMISSION_NOT_DETERMINED
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
    }),
    [SET_TRACKING_PERMISSION]: (state, payload) => ({
      ...state,
      trackingPermission: payload
    })
  },
  initialState
)
