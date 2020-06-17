import { createReducer } from 'redux-act'
import {
  GET_PREDISCOVERY,
  GET_PREDISCOVERY_SUCCESS
} from 'state/actions/storage'

const initialState = {
  currentStep: '',
  prediscovery: {},
  error: ''
}

const eqsSteps = {
  PREDISCOVERY: 'PREDISCOVERY',
  DEVICE_MAP: 'DEVICE_MAP'
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
    })
  },
  initialState
)
