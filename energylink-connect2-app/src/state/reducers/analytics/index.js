import { createReducer } from 'redux-act'
import {
  BEGIN_INSTALL,
  COMMISSION_SUCCESS,
  CONFIG_START,
  SET_AC_DEVICES
} from 'state/actions/analytics'
import { PUSH_CANDIDATES_INIT } from 'state/actions/devices'
import { SUBMIT_CONFIG } from 'state/actions/systemConfiguration'

export const initialState = {
  commissioningTimer: new Date().getTime(),
  configureTimer: new Date().getTime(),
  timeFromMiScan: new Date().getTime(),
  submitTimer: new Date().getTime(),
  commissioningSuccess: false,
  selectingACModelTimer: new Date().getTime()
}

export default createReducer(
  {
    [CONFIG_START]: (state, { siteChanged }) => ({
      ...state,
      configureTimer: siteChanged ? new Date().getTime() : state.configureTimer
    }),
    [PUSH_CANDIDATES_INIT]: state => ({
      ...state,
      timeFromMiScan: new Date().getTime()
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
