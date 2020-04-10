import { createReducer } from 'redux-act'
import { TOGGLE_MODAL } from '../../actions/modal'
import {
  SELECT_ENERGY_GRAPH,
  GRAPHS,
  DATA_SOURCES,
  SELECT_DATA_SOURCE
} from '../../actions/user'
import { DEVICE_RESUME } from '../../actions/mobile'
import {
  SEND_FEEDBACK_INIT,
  SEND_FEEDBACK_SUCCESS,
  SEND_FEEDBACK_ERROR,
  RESET_FEEDBACK_FORM
} from '../../actions/feedback'

const defaultModalId = 'modal-root'

const initialState = {
  modal: {
    isActive: false,
    modalId: defaultModalId
  },
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
    [TOGGLE_MODAL]: (state, { isActive, modalId = defaultModalId }) => ({
      ...state,
      modal: {
        isActive,
        modalId
      }
    }),
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
