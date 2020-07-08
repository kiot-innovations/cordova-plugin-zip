import { createReducer } from 'redux-act'
import {
  GET_ESS_STATUS_SUCCESS,
  GET_ESS_STATUS_ERROR,
  GET_ESS_STATUS_INIT,
  GET_PREDISCOVERY,
  GET_PREDISCOVERY_SUCCESS,
  GET_PREDISCOVERY_ERROR,
  POST_COMPONENT_MAPPING,
  POST_COMPONENT_MAPPING_ERROR,
  UPLOAD_EQS_FIRMWARE,
  UPLOAD_EQS_FIRMWARE_SUCCESS,
  UPLOAD_EQS_FIRMWARE_ERROR,
  TRIGGER_EQS_FIRMWARE_SUCCESS,
  TRIGGER_EQS_FIRMWARE_ERROR,
  UPDATE_EQS_FIRMWARE_PROGRESS,
  UPDATE_EQS_FIRMWARE_COMPLETED,
  UPDATE_EQS_FIRMWARE_ERROR,
  GET_COMPONENT_MAPPING_PROGRESS,
  GET_COMPONENT_MAPPING_COMPLETED,
  GET_COMPONENT_MAPPING_ERROR,
  RESET_COMPONENT_MAPPING
} from 'state/actions/storage'

const initialState = {
  currentStep: '',
  prediscovery: {},
  componentMapping: {},
  deviceUpdate: {},
  status: {
    waiting: false,
    results: null,
    error: null
  },
  error: ''
}

export const eqsSteps = {
  PREDISCOVERY: 'PREDISCOVERY',
  COMPONENT_MAPPING: 'COMPONENT_MAPPING',
  FW_UPLOAD: 'FW_UPLOAD',
  FW_UPDATE: 'FW_UPDATE',
  FW_POLL: 'FW_POLL',
  FW_COMPLETED: 'FW_COMPLETED',
  FW_ERROR: 'FW_ERROR'
}

export const storageReducer = createReducer(
  {
    [GET_ESS_STATUS_INIT]: state => ({
      ...state,
      status: { waiting: true, results: null, error: null }
    }),
    [GET_ESS_STATUS_SUCCESS]: (state, results) => ({
      ...state,
      status: { results, waiting: false, error: null }
    }),
    [GET_ESS_STATUS_ERROR]: (state, error) => ({
      ...state,
      status: { error, waiting: false }
    }),
    [GET_PREDISCOVERY]: state => ({
      ...state,
      currentStep: eqsSteps.PREDISCOVERY
    }),
    [GET_PREDISCOVERY_SUCCESS]: (state, payload) => ({
      ...state,
      prediscovery: payload
    }),
    [GET_PREDISCOVERY_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [POST_COMPONENT_MAPPING]: state => ({
      ...state,
      currentStep: eqsSteps.COMPONENT_MAPPING
    }),
    [POST_COMPONENT_MAPPING_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [UPLOAD_EQS_FIRMWARE]: state => ({
      ...state,
      currentStep: eqsSteps.FW_UPLOAD
    }),
    [UPLOAD_EQS_FIRMWARE_SUCCESS]: state => ({
      ...state,
      currentStep: eqsSteps.FW_UPDATE
    }),
    [UPLOAD_EQS_FIRMWARE_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [TRIGGER_EQS_FIRMWARE_SUCCESS]: state => ({
      ...state,
      currentStep: eqsSteps.FW_POLL
    }),
    [TRIGGER_EQS_FIRMWARE_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [UPDATE_EQS_FIRMWARE_PROGRESS]: (state, payload) => ({
      ...state,
      deviceUpdate: payload
    }),
    [UPDATE_EQS_FIRMWARE_COMPLETED]: (state, payload) => ({
      ...state,
      deviceUpdate: payload,
      currentStep: eqsSteps.FW_COMPLETED
    }),
    [UPDATE_EQS_FIRMWARE_ERROR]: (state, payload) => ({
      ...state,
      error: payload.error,
      deviceUpdate: payload.response,
      currentStep: eqsSteps.FW_ERROR
    }),
    [GET_COMPONENT_MAPPING_PROGRESS]: (state, payload) => ({
      ...state,
      componentMapping: payload
    }),
    [GET_COMPONENT_MAPPING_COMPLETED]: (state, payload) => ({
      ...state,
      componentMapping: payload
    }),
    [GET_COMPONENT_MAPPING_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [RESET_COMPONENT_MAPPING]: state => ({
      ...state,
      error: '',
      componentMapping: {}
    })
  },
  initialState
)
