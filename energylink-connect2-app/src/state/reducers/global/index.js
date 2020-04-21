import { createReducer } from 'redux-act'
import {
  RESET_FEEDBACK_FORM,
  SEND_FEEDBACK_ERROR,
  SEND_FEEDBACK_INIT,
  SEND_FEEDBACK_SUCCESS
} from '../../actions/feedback'
import { DEVICE_RESUME } from '../../actions/mobile'
import {
  DATA_SOURCES,
  GRAPHS,
  SELECT_DATA_SOURCE,
  SELECT_ENERGY_GRAPH
} from '../../actions/user'

const initialState = {
  isAccountCreated: false,
  isDeviceResumeListened: false,
  selectedEnergyGraph: GRAPHS.POWER,
  isSendingFeedback: false,
  isFeedbackSuccessful: false,
  selectedDataSource: DATA_SOURCES.LIVE,
  feedbackError: null
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
    [DEVICE_RESUME]: state => ({ ...state, isDeviceResumeListened: true }),
    [SEND_FEEDBACK_INIT]: state => ({ ...state, isSendingFeedback: true }),
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
    [RESET_FEEDBACK_FORM]: state => ({ ...state, isFeedbackSuccessful: false })
  },
  initialState
)
