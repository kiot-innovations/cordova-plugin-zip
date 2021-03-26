import { createReducer } from 'redux-act'
import {
  BEGIN_INSTALL,
  COMMISSION_SUCCESS,
  CONFIG_START,
  SET_AC_DEVICES
} from 'state/actions/analytics'
import { PUSH_CANDIDATES_INIT } from 'state/actions/devices'
import { SUBMIT_CONFIG } from 'state/actions/systemConfiguration'
import { CONNECT_NETWORK_AP_INIT } from 'state/actions/systemConfiguration'

export const initialState = {
  commissioningTimer: 0,
  configureTimer: 0,
  pvsInternetTimer: 0,
  selectingACModelTimer: 0,
  submitTimer: 0,
  timeFromMiScan: 0,
  commissioningSuccess: false,
  siteUnderCommissioning: ''
}

const siteUnderCommissioningChanged = (siteKey, siteUnderCommissioning) => {
  if (!siteKey && !siteUnderCommissioning) {
    return false
  }

  return siteKey !== siteUnderCommissioning
}

export default createReducer(
  {
    [CONFIG_START]: state => ({
      ...state,
      configureTimer: new Date().getTime()
    }),
    [PUSH_CANDIDATES_INIT]: state => ({
      ...state,
      timeFromMiScan: new Date().getTime()
    }),
    [SUBMIT_CONFIG]: state => ({
      ...state,
      submitTimer: new Date().getTime()
    }),
    [BEGIN_INSTALL]: (state, { siteKey }) => {
      const siteChanged = siteUnderCommissioningChanged(
        siteKey,
        state.siteUnderCommissioning
      )

      return {
        ...state,
        siteUnderCommissioning: siteKey,
        commissioningTimer: siteChanged
          ? new Date().getTime()
          : state.commissioningTimer,
        commissioningSuccess: siteChanged ? false : state.commissioningSuccess
      }
    },
    [SET_AC_DEVICES]: state => ({
      ...state,
      selectingACModelTimer: new Date().getTime()
    }),
    [COMMISSION_SUCCESS]: state => ({
      ...state,
      commissioningSuccess: true
    }),
    [CONNECT_NETWORK_AP_INIT]: state => ({
      ...state,
      pvsInternetTimer: new Date().getTime()
    })
  },
  initialState
)
