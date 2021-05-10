import { filter } from 'ramda'
import { createReducer } from 'redux-act'
import {
  RESET_FEEDBACK_FORM,
  SEND_FEEDBACK_ERROR,
  SEND_FEEDBACK_INIT,
  SEND_FEEDBACK_SUCCESS
} from 'state/actions/feedback'
import { DEVICE_RESUME } from 'state/actions/mobile'
import {
  DATA_SOURCES,
  GRAPHS,
  SELECT_DATA_SOURCE,
  SELECT_ENERGY_GRAPH
} from 'state/actions/user'
import {
  SET_LAST_VISITED_PAGE,
  RESET_LAST_VISITED_PAGE,
  CHECK_APP_UPDATE_SUCCESS,
  CHECK_APP_UPDATE_ERROR,
  SHOW_PRECOMMISSIONING_CHECKLIST,
  SET_STATUS_MESSAGES
} from 'state/actions/global'
import { SET_SCANDIT_ACCESS } from 'state/actions/scandit'
import {
  RESET_COMMISSIONING,
  CHECK_SSL_CERTS,
  CHECK_SSL_CERTS_SUCCESS,
  CHECK_SSL_CERTS_ERROR
} from 'state/actions/global'
import { SET_SHOW_CHECKLIST } from 'state/actions/settings'

const initialState = {
  isAccountCreated: false,
  isDeviceResumeListened: false,
  selectedEnergyGraph: GRAPHS.POWER,
  isSendingFeedback: false,
  isFeedbackSuccessful: false,
  selectedDataSource: DATA_SOURCES.LIVE,
  feedbackError: null,
  lastVisitedPage: null,
  canAccessScandit: true,
  updateAvailable: false,
  updateVersion: 0,
  showPrecommissioningChecklist: true,
  checkingSSLCerts: false,
  hasValidSSLCerts: null,
  statusMessages: []
}

const shouldShow = message => {
  const now = new Date()
  const hasStartDate = message.startDate !== undefined
  const hasEndDate = message.endDate !== undefined

  if (!hasStartDate && !hasEndDate) {
    return true
  } else if (hasStartDate && !hasEndDate) {
    const startDate = new Date(message.startDate)
    return now > startDate
  } else if (!hasStartDate && hasEndDate) {
    const endDate = new Date(message.endDate)
    return now < endDate
  } else if (hasStartDate && hasEndDate) {
    const startDate = new Date(message.startDate)
    const endDate = new Date(message.endDate)
    return now > startDate && now < endDate
  }
}

export const globalReducer = createReducer(
  {
    [SELECT_ENERGY_GRAPH]: (state, action) => ({
      ...state,
      selectedEnergyGraph: action
    }),
    [SELECT_DATA_SOURCE]: (state, action) => ({
      ...state,
      selectedDataSource: action
    }),
    [DEVICE_RESUME]: state => ({
      ...state,
      isDeviceResumeListened: true
    }),
    [SEND_FEEDBACK_INIT]: state => ({
      ...state,
      isSendingFeedback: true
    }),
    [SEND_FEEDBACK_SUCCESS]: state => ({
      ...state,
      isSendingFeedback: false,
      isFeedbackSuccessful: true,
      feedbackError: false
    }),
    [SEND_FEEDBACK_ERROR]: (state, payload) => ({
      ...state,
      feedbackError: payload,
      isSendingFeedback: false
    }),
    [RESET_FEEDBACK_FORM]: state => ({
      ...state,
      isFeedbackSuccessful: false
    }),
    [SET_LAST_VISITED_PAGE]: (state, lastVisitedPage) => ({
      ...state,
      lastVisitedPage
    }),
    [RESET_LAST_VISITED_PAGE]: state => ({
      ...state,
      lastVisitedPage: initialState.lastVisitedPage
    }),
    [RESET_COMMISSIONING]: state => ({
      ...state,
      canAccessScandit: initialState.canAccessScandit,
      checkingSSLCerts: initialState.checkingSSLCerts,
      feedbackError: initialState.feedbackError,
      hasValidSSLCerts: initialState.hasValidSSLCerts,
      isAccountCreated: initialState.isAccountCreated,
      isDeviceResumeListened: initialState.isDeviceResumeListened,
      isFeedbackSuccessful: initialState.isFeedbackSuccessful,
      isSendingFeedback: initialState.isSendingFeedback,
      lastVisitedPage: initialState.lastVisitedPage,
      selectedEnergyGraph: initialState.selectedEnergyGraph,
      selectedDataSource: initialState.selectedDataSource,
      updateAvailable: initialState.updateAvailable,
      updateVersion: initialState.updateVersion
    }),
    [SET_SCANDIT_ACCESS]: (state, canAccessScandit) => ({
      ...state,
      canAccessScandit
    }),
    [CHECK_APP_UPDATE_SUCCESS]: (state, updateVersion) => ({
      ...state,
      updateAvailable: true,
      updateVersion
    }),
    [CHECK_APP_UPDATE_ERROR]: state => ({
      ...state,
      updateAvailable: false,
      updateVersion: 0
    }),
    [SHOW_PRECOMMISSIONING_CHECKLIST]: (state, payload) => ({
      ...state,
      showPrecommissioningChecklist: payload
    }),
    [CHECK_SSL_CERTS]: state => ({
      ...state,
      checkingSSLCerts: true
    }),
    [CHECK_SSL_CERTS_SUCCESS]: state => ({
      ...state,
      checkingSSLCerts: false,
      hasValidSSLCerts: true
    }),
    [CHECK_SSL_CERTS_ERROR]: state => ({
      ...state,
      checkingSSLCerts: false,
      hasValidSSLCerts: false
    }),
    [SET_SHOW_CHECKLIST]: (state, showPrecommissioningChecklist) => ({
      ...state,
      showPrecommissioningChecklist
    }),
    [SET_STATUS_MESSAGES]: (state, statusMessages) => ({
      ...state,
      statusMessages: filter(shouldShow, statusMessages)
    })
  },
  initialState
)
