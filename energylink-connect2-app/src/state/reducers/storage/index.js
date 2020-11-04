import { createReducer } from 'redux-act'
import { isEmpty } from 'ramda'
import {
  CHECK_EQS_FIRMWARE,
  GET_COMPONENT_MAPPING_COMPLETED,
  GET_COMPONENT_MAPPING_ERROR,
  GET_COMPONENT_MAPPING_PROGRESS,
  GET_DELAYED_PREDISCOVERY,
  GET_ESS_STATUS_ERROR,
  GET_ESS_STATUS_INIT,
  GET_ESS_STATUS_SUCCESS,
  GET_PREDISCOVERY,
  GET_PREDISCOVERY_ERROR,
  GET_PREDISCOVERY_RESET,
  GET_PREDISCOVERY_SUCCESS,
  POST_COMPONENT_MAPPING,
  POST_COMPONENT_MAPPING_ERROR,
  RESET_COMPONENT_MAPPING,
  TRIGGER_EQS_FIRMWARE_ERROR,
  TRIGGER_EQS_FIRMWARE_SUCCESS,
  UPDATE_EQS_FIRMWARE_COMPLETED,
  UPDATE_EQS_FIRMWARE_ERROR,
  UPDATE_EQS_FIRMWARE_PROGRESS,
  UPLOAD_EQS_FIRMWARE,
  UPLOAD_EQS_FIRMWARE_ERROR,
  UPLOAD_EQS_FIRMWARE_PROGRESS,
  TRIGGER_EQS_FIRMWARE_UPDATE_INIT
} from 'state/actions/storage'
import { eqsUpdateStates } from 'state/epics/storage/deviceUpdate'

const initialState = {
  currentStep: '',
  prediscovery: {},
  componentMapping: {},
  deviceUpdate: {},
  updateProgress: 0,
  status: {
    waiting: false,
    results: null,
    error: null
  },
  error: '',
  loadingPrediscovery: false
}

export const eqsSteps = {
  PREDISCOVERY: 'PREDISCOVERY',
  COMPONENT_MAPPING: 'COMPONENT_MAPPING',
  FW_UPLOAD: 'FW_UPLOAD',
  FW_UPDATE: 'FW_UPDATE',
  FW_POLL: 'FW_POLL',
  FW_COMPLETED: 'FW_COMPLETED',
  FW_ERROR: 'FW_ERROR',
  HEALTH_CHECK: 'HEALTH_CHECK'
}

export const storageReducer = createReducer(
  {
    [GET_ESS_STATUS_INIT]: state => ({
      ...state,
      status: { waiting: true, results: null, error: null },
      currentStep: eqsSteps.HEALTH_CHECK
    }),
    [GET_ESS_STATUS_SUCCESS]: (state, results) => ({
      ...state,
      status: { results, waiting: false, error: null }
    }),
    [GET_ESS_STATUS_ERROR]: (state, error) => ({
      ...state,
      status: { ...state.status, error, waiting: false }
    }),
    [GET_PREDISCOVERY]: state => ({
      ...state,
      currentStep: eqsSteps.PREDISCOVERY,
      loadingPrediscovery: true
    }),
    [GET_DELAYED_PREDISCOVERY]: state => ({
      ...state,
      currentStep: eqsSteps.PREDISCOVERY,
      loadingPrediscovery: true
    }),
    [GET_PREDISCOVERY_SUCCESS]: (state, payload) => ({
      ...state,
      prediscovery: payload,
      error: '',
      loadingPrediscovery: false
    }),
    [GET_PREDISCOVERY_ERROR]: (state, payload) => ({
      ...state,
      error: payload,
      loadingPrediscovery: false
    }),
    [GET_PREDISCOVERY_RESET]: state => ({
      ...state,
      prediscovery: {},
      error: ''
    }),
    [POST_COMPONENT_MAPPING]: state => ({
      ...state,
      currentStep: eqsSteps.COMPONENT_MAPPING
    }),
    [POST_COMPONENT_MAPPING_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [CHECK_EQS_FIRMWARE]: state => ({
      ...state,
      error: initialState.error,
      currentStep: eqsSteps.FW_UPLOAD,
      deviceUpdate: initialState.deviceUpdate
    }),
    [UPLOAD_EQS_FIRMWARE]: state => ({
      ...state,
      currentStep: eqsSteps.FW_UPLOAD,
      updateProgress: 0
    }),
    [TRIGGER_EQS_FIRMWARE_UPDATE_INIT]: state => ({
      ...state,
      error: initialState.error,
      deviceUpdate: initialState.deviceUpdate,
      currentStep: eqsSteps.FW_UPDATE
    }),
    [UPLOAD_EQS_FIRMWARE_PROGRESS]: (state, { progress = 0 }) => ({
      ...state,
      updateProgress: progress
    }),
    [UPLOAD_EQS_FIRMWARE_ERROR]: (state, payload) => ({
      ...state,
      currentStep: eqsSteps.FW_ERROR,
      deviceUpdate: { firmware_update_status: eqsUpdateStates.FAILED },
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
      componentMapping: !isEmpty(payload.payload)
        ? payload.payload
        : state.componentMapping,
      error: payload.error
    }),
    [RESET_COMPONENT_MAPPING]: state => ({
      ...state,
      error: '',
      componentMapping: {}
    })
  },
  initialState
)
