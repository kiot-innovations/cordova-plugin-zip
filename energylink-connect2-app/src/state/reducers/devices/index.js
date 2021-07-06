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
  FETCH_MODELS_SUCCESS,
  PUSH_CANDIDATES_ERROR,
  PUSH_CANDIDATES_INIT,
  RESET_DISCOVERY,
  RESET_DISCOVERY_PROGRESS,
  SAVE_OK_MI,
  UPDATE_DEVICES_LIST,
  UPDATE_DEVICES_LIST_ERROR
} from 'state/actions/devices'
import { RESET_COMMISSIONING } from 'state/actions/global'

const defaultModels = {
  C: [
    'SPR-E19-320-C-AC',
    'SPR-E20-327-C-AC',
    'SPR-X21-335-BLK-C-AC',
    'SPR-X21-335-C-AC',
    'SPR-X21-345-C-AC',
    'SPR-X22-360-C-AC'
  ],
  D: [
    'SPR-E20-327-D-AC',
    'SPR-X19-315-D-AC',
    'SPR-X20-327-BLK-D-AC',
    'SPR-X20-327-D-AC',
    'SPR-X21-335-BLK-D-AC',
    'SPR-X21-335-D-AC',
    'SPR-X21-345-D-AC',
    'SPR-X21-350-BLK-D-AC',
    'SPR-X22-360-D-AC',
    'SPR-X22-370-D-AC',
    'SPR-240E-WHT-D AR'
  ],
  E: [
    'SPR-E19-320-E-AC',
    'SPR-E20-327-E-AC',
    'SPR-X20-327-BLK-E-AC',
    'SPR-X20-327-E-AC',
    'SPR-X21-335-BLK-E-AC',
    'SPR-X21-335-E-AC',
    'SPR-X21-345-E-AC',
    'SPR-X21-350-BLK-E-AC',
    'SPR-X22-360-E-AC',
    'SPR-X22-370-E-AC',
    'SPR-X21-355-E-AC'
  ],
  G: [
    'SPR-A390-G-AC',
    'SPR-A400-G-AC',
    'SPR-A410-G-AC',
    'SPR-A415-G-AC',
    'SPR-A420-G-AC',
    'SPR-A390-BLK-G-AC',
    'SPR-A400-BLK-G-AC'
  ],
  H: [
    'SPR-A390-H-AC',
    'SPR-A400-H-AC',
    'SPR-A410-H-AC',
    'SPR-A415-H-AC',
    'SPR-A420-H-AC',
    'SPR-A390-BLK-H-AC',
    'SPR-A400-BLK-H-AC'
  ]
}

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
  miModels: defaultModels,
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
    [RESET_DISCOVERY]: (state, payload) => ({
      ...initialState,
      found: propOr(false, 'keepDeviceList', payload)
        ? state.found
        : initialState.found,
      miModels: state.miModels
    }),
    [RESET_DISCOVERY_PROGRESS]: state => ({
      ...state,
      isFetching: false,
      discoveryComplete: false,
      progress: initialState.progress
    }),
    [RESET_COMMISSIONING]: () => initialState,
    [FETCH_MODELS_SUCCESS]: (state, miModels) => ({
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
