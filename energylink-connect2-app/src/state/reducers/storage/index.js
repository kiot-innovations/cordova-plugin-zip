import { createReducer } from 'redux-act'
import {
  GET_PREDISCOVERY,
  GET_PREDISCOVERY_SUCCESS,
  POST_COMPONENT_MAPPING,
  POST_COMPONENT_MAPPING_ERROR
} from 'state/actions/storage'

const initialState = {
  currentStep: '',
  prediscovery: {},
  componentMapping: {},
  error: ''
}

const eqsSteps = {
  PREDISCOVERY: 'PREDISCOVERY',
  COMPONENT_MAPPING: 'COMPONENT_MAPPING'
}

export const storageReducer = createReducer(
  {
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
