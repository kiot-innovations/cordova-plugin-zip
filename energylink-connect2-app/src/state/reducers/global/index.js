import { createReducer } from 'redux-act'
import { TOGGLE_MODAL } from '../../actions/modal'
import { SELECT_ENERGY_GRAPH, GRAPHS } from '../../actions/user'
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
  selectedEnergyGraph: GRAPHS.ENERGY,
  isSendingFeedback: false,
  isFeedbackSuccessful: false
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
    [DEVICE_RESUME]: state => ({ ...state, isDeviceResumeListened: true }),
    [SEND_FEEDBACK_INIT]: state => ({ ...state, isSendingFeedback: true }),
    [SEND_FEEDBACK_SUCCESS]: state => ({
      ...state,
      isSendingFeedback: false,
      isFeedbackSuccessful: true
    }),
    [SEND_FEEDBACK_ERROR]: (state, payload) => ({
      ...state,
      err: { ...payload },
      isSendingFeedback: false
    }),
    [RESET_FEEDBACK_FORM]: state => ({ ...state, isFeedbackSuccessful: false })
  },
  initialState
)
