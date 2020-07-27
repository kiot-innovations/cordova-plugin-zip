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
  SET_SELECTED_POWER_PRODUCTION
} from 'state/actions/systemConfiguration'

const initialState = {
  isSetting: false,
  isPolling: false,
  selectedPowerProduction: null,
  data: {
    powerProduction: null,
    progress: null
  },
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
      }
    }),
    [GET_RSE_SUCCESS]: (state, payload) => ({
      ...state,
      isSetting: state.isPolling && propOr(0, 'progress', payload) < 100,
      data: payload,
      selectedPowerProduction: payload.powerProduction
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
      selectedPowerProduction: state.data.powerProduction
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
      selectedPowerProduction
    })
  },
  initialState
)

export default rseReducer
