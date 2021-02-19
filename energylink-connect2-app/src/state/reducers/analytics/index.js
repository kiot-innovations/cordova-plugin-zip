import { createReducer } from 'redux-act'
import {
  BEGIN_INSTALL,
  COMMISSION_SUCCESS,
  CONFIG_START,
  SET_AC_DEVICES
} from 'state/actions/analytics'
import { SUBMIT_CONFIG } from 'state/actions/systemConfiguration'

const initialState = {
  commissioningTimer: 0,
  configureTimer: 0,
  commissioningSuccess: false,
  selectingACModelTimer: new Date().getTime(),
  submitTimer: new Date().getTime()
}

export default createReducer(
  {
    [CONFIG_START]: (state, { siteChanged }) => ({
      ...state,
      configureTimer: siteChanged ? new Date().getTime() : state.configureTimer
    }),
    [SUBMIT_CONFIG]: state => ({
      ...state,
      submitTimer: new Date().getTime()
    }),
    [BEGIN_INSTALL]: (state, { siteChanged }) => ({
      ...state,
      commissioningTimer: siteChanged
        ? new Date().getTime()
        : state.commissioningTimer,
      commissioningSuccess: siteChanged ? false : state.commissioningSuccess
    }),
    [SET_AC_DEVICES]: state => ({
      ...state,
      selectingACModelTimer: new Date().getTime()
    }),
    [COMMISSION_SUCCESS]: state => ({
      ...state,
      commissioningSuccess: true
    })
  },
  initialState
)
