import { createReducer } from 'redux-act'

import {
  SET_TUTORIAL,
  RESET_TUTORIAL,
  UPDATE_TUTORIALS
} from 'state/actions/knowledgeBase'

export const status = {
  NEVER_FETCHED: 'neverFetched',
  FETCHED: 'fetched',
  UNKNOWN: 'unknown'
}

const initialState = {
  tutorialList: [],
  currentTutorial: {},
  status: status.NEVER_FETCHED,
  lastSuccessfulUpdateOn: 0
}

export default createReducer(
  {
    [SET_TUTORIAL]: (state, payload) => ({
      ...state,
      currentTutorial: payload
    }),
    [RESET_TUTORIAL]: state => ({
      ...state,
      currentTutorial: {}
    }),
    [UPDATE_TUTORIALS]: (state, { tutorialList, timestamp, status }) => ({
      ...state,
      tutorialList: tutorialList,
      lastSuccessfulUpdateOn: timestamp,
      status: status
    })
  },
  initialState
)
