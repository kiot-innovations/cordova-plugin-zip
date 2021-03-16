import { createReducer } from 'redux-act'
import { length, pathOr, propOr } from 'ramda'
import {
  CLAIM_DEVICES_COMPLETE,
  CLAIM_DEVICES_ERROR,
  CLAIM_DEVICES_INIT,
  CLAIM_DEVICES_RESET,
  CLAIM_DEVICES_UPDATE,
  DISCOVER_COMPLETE,
  DISCOVER_ERROR,
  DISCOVER_INIT,
  DISCOVER_UPDATE,
  FETCH_CANDIDATES_COMPLETE,
  FETCH_CANDIDATES_ERROR,
  FETCH_CANDIDATES_INIT,
  FETCH_CANDIDATES_UPDATE,
  FETCH_DEVICES_LIST,
  FETCH_MODELS_LOAD_DEFAULT,
  FETCH_MODELS_SUCCESS,
  PUSH_CANDIDATES_ERROR,
  PUSH_CANDIDATES_INIT,
  RESET_DISCOVERY,
  SAVE_OK_MI,
  UPDATE_DEVICES_LIST,
  UPDATE_DEVICES_LIST_ERROR
} from 'state/actions/devices'
import { RESET_COMMISSIONING } from 'state/actions/global'

export const discoveryTypes = {
  LEGACY: 'LEGACY',
  ALLNOMI: 'ALLNOMI',
  STORAGE: 'STORAGE',
  ONLYMI: 'ONLYMI'
}

const initialState = {
  isFetching: false,
  found: [],
  progress: {},
  error: '',
  pushCandidatesError: false,
  isFetchingCandidates: false,
  candidates: [],
  allCandidatesFound: false,
  discoveryComplete: false,
  claimingDevices: false,
  claimProgress: 0,
  claimedDevices: false,
  claimError: '',
  miModels: [],
  fetchingDevices: false
}

export default createReducer(
  {
    [DISCOVER_INIT]: state => ({
      ...state,
      isFetching: true,
      found: [],
      progress: {},
      discoveryComplete: false,
      error: ''
    }),
    [DISCOVER_UPDATE]: (state, payload) => ({
      ...state,
      found: pathOr(state.found, ['devices', 'devices'], payload),
      progress: propOr(state.progress, 'progress', payload)
    }),
    [DISCOVER_COMPLETE]: (state, payload) => ({
      ...state,
      isFetching: false,
      found: pathOr(state.found, ['devices', 'devices'], payload),
      progress: propOr(state.progress, 'progress', payload),
      discoveryComplete: true,
      error: ''
    }),
    [DISCOVER_ERROR]: (state, payload) => ({
      ...state,
      isFetching: false,
      progress: {},
      error: payload
    }),
    [PUSH_CANDIDATES_INIT]: state => ({
      ...state,
      pushCandidatesError: initialState.error
    }),
    [PUSH_CANDIDATES_ERROR]: (state, payload) => ({
      ...state,
      error: payload
    }),
    [FETCH_CANDIDATES_INIT]: state => ({
      ...state,
      isFetchingCandidates: true
    }),
    [FETCH_CANDIDATES_UPDATE]: (state, payload) => ({
      ...state,
      isFetchingCandidates: true,
      candidates: length(payload) !== 0 ? payload : state.candidates
    }),
    [FETCH_CANDIDATES_COMPLETE]: state => ({
      ...state,
      isFetchingCandidates: false,
      allCandidatesFound: true
    }),
    [FETCH_CANDIDATES_ERROR]: (state, payload) => ({
      ...state,
      isFetchingCandidates: false,
      candidates: [],
      error: payload
    }),
    [CLAIM_DEVICES_INIT]: state => ({
      ...state,
      claimingDevices: true,
      claimedDevices: false,
      claimProgress: 0,
      claimError: ''
    }),
    [CLAIM_DEVICES_UPDATE]: (state, payload) => ({
      ...state,
      claimProgress: payload
    }),
    [CLAIM_DEVICES_COMPLETE]: state => ({
      ...state,
      claimProgress: 100,
      claimingDevices: false,
      claimedDevices: true
    }),
    [CLAIM_DEVICES_ERROR]: (state, payload) => ({
      ...state,
      claimingDevices: false,
      claimError: payload
    }),
    [CLAIM_DEVICES_RESET]: state => ({
      ...state,
      claimProgress: initialState.claimProgress,
      claimingDevices: initialState.claimingDevices,
      claimedDevices: initialState.claimedDevices,
      claimError: initialState.claimError
    }),
    [RESET_DISCOVERY]: state => ({
      ...initialState,
      miModels: state.miModels
    }),
    [RESET_COMMISSIONING]: () => initialState,
    [FETCH_MODELS_SUCCESS]: (state, miModels) => ({
      ...state,
      miModels
    }),
    [FETCH_MODELS_LOAD_DEFAULT]: (state, miModels) => ({
      ...state,
      miModels
    }),
    [FETCH_DEVICES_LIST]: state => ({
      ...state,
      fetchingDevices: true
    }),
    [UPDATE_DEVICES_LIST]: (state, payload) => ({
      ...state,
      found: payload,
      fetchingDevices: false
    }),
    [UPDATE_DEVICES_LIST_ERROR]: state => ({
      ...state,
      fetchingDevices: false
    }),
    [SAVE_OK_MI]: (state, miFound) => ({
      ...state,
      miFound
    })
  },
  initialState
)
