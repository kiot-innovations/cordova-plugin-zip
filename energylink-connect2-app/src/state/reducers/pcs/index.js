import { createReducer } from 'redux-act'

import {
  FETCH_PCS_SETTINGS_ERROR,
  FETCH_PCS_SETTINGS_INIT,
  FETCH_PCS_SETTINGS_SUCCESS,
  SET_BREAKER_RATING,
  SET_BUSBAR_RATING,
  SET_ENABLE_PCS,
  SET_HUB_PLUS_BREAKER_RATING,
  SET_PCS_APPLIED,
  SUBMIT_PCS_SETTINGS_ERROR,
  SUBMIT_PCS_SETTINGS_INIT,
  SUBMIT_PCS_SETTINGS_SUCCESS
} from 'state/actions/pcs'

const initialState = {
  busBarRating: 0,
  breakerRating: 0,
  hubPlusBreakerRating: 0,
  enablePCS: false,
  fetchingPCS: false,
  fetchPCSSettingsError: false,
  submittingPCS: false,
  submitPCSSettingsError: false,
  pcsApplied: false
}

export const pcsReducer = createReducer(
  {
    [SET_BUSBAR_RATING]: (state, payload) => ({
      ...state,
      busBarRating: payload
    }),

    [SET_BREAKER_RATING]: (state, payload) => ({
      ...state,
      breakerRating: payload
    }),

    [SET_HUB_PLUS_BREAKER_RATING]: (state, payload) => ({
      ...state,
      hubPlusBreakerRating: payload
    }),
    [SET_ENABLE_PCS]: (state, payload) => ({
      ...state,
      enablePCS: payload
    }),
    [SET_PCS_APPLIED]: (state, payload) => ({
      ...state,
      pcsApplied: payload
    }),
    [SUBMIT_PCS_SETTINGS_INIT]: (state, payload) => ({
      ...state,
      ...payload,
      submittingPCS: true,
      submitPCSSettingsError: false
    }),
    [SUBMIT_PCS_SETTINGS_SUCCESS]: state => ({
      ...state,
      submittingPCS: false,
      submitPCSSettingsError: false,
      pcsApplied: true
    }),
    [SUBMIT_PCS_SETTINGS_ERROR]: state => ({
      ...state,
      submittingPCS: false,
      submitPCSSettingsError: true
    }),
    [FETCH_PCS_SETTINGS_INIT]: state => ({
      ...state,
      fetchingPCS: true,
      fetchingPCSSettingsError: false,
      submittingPCS: false,
      submitPCSSettingsError: false
    }),
    [FETCH_PCS_SETTINGS_SUCCESS]: (state, response) => ({
      ...state,
      ...initialState,
      ...response
    }),
    [FETCH_PCS_SETTINGS_ERROR]: state => ({
      ...state,
      fetchingPCS: false,
      fetchPCSSettingsError: true,
      submittingPCS: false,
      submitPCSSettingsError: false
    })
  },
  initialState
)
