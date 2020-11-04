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
import {
  SET_LAST_VISITED_PAGE,
  RESET_LAST_VISITED_PAGE,
  CHECK_APP_UPDATE_SUCCESS,
  CHECK_APP_UPDATE_ERROR
} from 'state/actions/global'
import paths from 'routes/paths'
import { SET_SCANDIT_ACCESS } from 'state/actions/scandit'
import { RESET_COMMISSIONING } from 'state/actions/global'

const initialState = {
  isAccountCreated: false,
  isDeviceResumeListened: false,
  selectedEnergyGraph: GRAPHS.POWER,
  isSendingFeedback: false,
  isFeedbackSuccessful: false,
  selectedDataSource: DATA_SOURCES.LIVE,
  feedbackError: null,
  lastVisitedPage: paths.PROTECTED.PVS_SELECTION_SCREEN.path,
  canAccessScandit: true,
  updateAvailable: false,
  updateVersion: 0
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
    [RESET_COMMISSIONING]: () => initialState,
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
    })
  },
  initialState
)
