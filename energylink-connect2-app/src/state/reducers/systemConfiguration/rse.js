import { createReducer } from 'redux-act'
import { propOr } from 'ramda'
import {
  GET_RSE_INIT,
  GET_RSE_SUCCESS,
  GET_RSE_ERROR,
  SET_RSE_INIT,
  SET_RSE_SUCCESS,
  SET_RSE_STATUS,
  SET_RSE_ERROR,
  SET_SELECTED_POWER_PRODUCTION,
  RESET_SYSTEM_CONFIGURATION
} from 'state/actions/systemConfiguration'
import { RESET_COMMISSIONING } from 'state/actions/global'

const initialState = {
  isSetting: false,
  isPolling: false,
  selectedPowerProduction: null,
  data: {
    powerProduction: null,
    progress: null
  },
  updated: false,
  error: null
}

const rseReducer = createReducer(
  {
    [GET_RSE_INIT]: (state, isPolling = false) => ({
      ...(isPolling ? state : initialState),
      isPolling,
      data: {
        ...state.data,
        progress: null
      },
      updated: false
    }),
    [GET_RSE_SUCCESS]: (state, payload) => ({
      ...state,
      isSetting: state.isPolling && propOr(0, 'progress', payload) < 100,
      data: payload,
      selectedPowerProduction: state.isSetting
        ? state.selectedPowerProduction
        : payload.powerProduction,
      updated: false
    }),
    [GET_RSE_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [SET_RSE_INIT]: (state, payload) => ({
      ...state,
      isSetting: true
    }),
    [SET_RSE_STATUS]: state => ({
      ...state,
      isPolling: true
    }),
    [SET_RSE_SUCCESS]: state => ({
      ...state,
      isSetting: false,
      isPolling: false,
      selectedPowerProduction: state.data.powerProduction,
      updated: true
    }),
    [SET_RSE_ERROR]: (state, error) => ({
      ...state,
      isSetting: false,
      isPolling: false,
      selectedPowerProduction: state.data.powerProduction,
      error
    }),
    [SET_SELECTED_POWER_PRODUCTION]: (state, selectedPowerProduction) => ({
      ...state,
      selectedPowerProduction,
      updated: false
    }),
    [RESET_SYSTEM_CONFIGURATION]: () => initialState,
    [RESET_COMMISSIONING]: () => initialState
  },
  initialState
)

export default rseReducer
