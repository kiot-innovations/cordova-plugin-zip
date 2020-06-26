import { createReducer } from 'redux-act'
import {
  GET_ESS_STATUS_SUCCESS,
  GET_ESS_STATUS_ERROR,
  GET_ESS_STATUS_INIT,
  GET_PREDISCOVERY,
  GET_PREDISCOVERY_SUCCESS,
  POST_COMPONENT_MAPPING,
  POST_COMPONENT_MAPPING_ERROR
} from 'state/actions/storage'

const initialState = {
  currentStep: '',
  prediscovery: {},
  componentMapping: {},
  error: '',
  status: {
    results: null,
    error: null
  }
}

const eqsSteps = {
  PREDISCOVERY: 'PREDISCOVERY',
  COMPONENT_MAPPING: 'COMPONENT_MAPPING'
}

export const storageReducer = createReducer(
  {
    [GET_ESS_STATUS_INIT]: state => ({
      ...state,
      status: { results: null, error: null }
    }),
    [GET_ESS_STATUS_SUCCESS]: (state, results) => ({
      ...state,
      status: { results, error: null }
    }),
    [GET_ESS_STATUS_ERROR]: (state, error) => ({
      ...state,
      status: { error }
    }),
    [GET_PREDISCOVERY]: state => ({
      ...state,
      currentStep: eqsSteps.PREDISCOVERY
    }),
    [GET_PREDISCOVERY_SUCCESS]: (state, payload) => ({
      ...state,
      prediscovery: payload
    }),
    [POST_COMPONENT_MAPPING]: (state, payload) => ({
      ...state,
      currentStep: eqsSteps.COMPONENT_MAPPING
    }),
    [POST_COMPONENT_MAPPING_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    })
  },
  initialState
)
