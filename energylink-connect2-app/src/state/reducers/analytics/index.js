import { createReducer } from 'redux-act'
import { BEGIN_INSTALL, COMMISSION_SUCCESS } from 'state/actions/analytics'

const initialState = {
  commissioningTimer: 0,
  commissioningSuccess: false
}

export default createReducer(
  {
    [BEGIN_INSTALL]: (state, { siteChanged }) => ({
      ...state,
      commissioningTimer: siteChanged
        ? new Date().getTime()
        : state.commissioningTimer,
      commissioningSuccess: siteChanged ? false : state.commissioningSuccess
    }),
    [COMMISSION_SUCCESS]: state => ({
      ...state,
      commissioningSuccess: true
    })
  },
  initialState
)
