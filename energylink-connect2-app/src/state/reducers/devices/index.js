import { createReducer } from 'redux-act'
import { length } from 'ramda'
import {
  DISCOVER_COMPLETE,
  DISCOVER_INIT,
  DISCOVER_UPDATE,
  DISCOVER_ERROR,
  FETCH_CANDIDATES_INIT,
  FETCH_CANDIDATES_UPDATE,
  FETCH_CANDIDATES_COMPLETE,
  FETCH_CANDIDATES_ERROR,
  CLAIM_DEVICES_INIT,
  CLAIM_DEVICES_SUCCESS,
  CLAIM_DEVICES_ERROR,
  RESET_DISCOVERY
} from 'state/actions/devices'

const initialState = {
  isFetching: false,
  found: {},
  progress: {},
  error: '',
  isFetchingCandidates: false,
  candidates: [],
  allCandidatesFound: false,
  discoveryComplete: false,
  claimingDevices: false,
  claimedDevices: false
}

const parseCompleteDevices = devices => {
  const returnValue = {}
  devices.forEach(device => {
    const deviceType = device.DEVICE_TYPE.toLowerCase()
    const propertyExists = !!returnValue[deviceType]
    if (propertyExists)
      returnValue[deviceType] = [...returnValue[deviceType], device]
    else returnValue[deviceType] = [device]
  })
  return returnValue
}

export default createReducer(
  {
    [DISCOVER_INIT]: state => ({ ...state, isFetching: true }),
    [DISCOVER_UPDATE]: (state, payload) => {
      return {
        ...state,
        found: payload
          ? parseCompleteDevices(payload.devices.devices)
          : state.found,
        progress: payload ? payload.progress : state.progress
      }
    },
    [DISCOVER_COMPLETE]: (state, payload) => {
      return {
        ...state,
        isFetching: false,
        found: payload
          ? parseCompleteDevices(payload.devices.devices)
          : state.found,
        progress: payload ? payload.progress : state.progress,
        discoveryComplete: true
      }
    },
    [DISCOVER_ERROR]: (state, payload) => {
      return {
        ...state,
        isFetching: false,
        progress: {},
        error: payload
      }
    },
    [FETCH_CANDIDATES_INIT]: state => {
      return {
        ...state,
        isFetchingCandidates: true
      }
    },
    [FETCH_CANDIDATES_UPDATE]: (state, payload) => {
      return {
        ...state,
        isFetchingCandidates: true,
        candidates: length(payload) !== 0 ? payload : state.candidates
      }
    },
    [FETCH_CANDIDATES_COMPLETE]: state => {
      return {
        ...state,
        isFetchingCandidates: false,
        allCandidatesFound: true
      }
    },
    [FETCH_CANDIDATES_ERROR]: (state, payload) => {
      return {
        ...state,
        isFetchingCandidates: false,
        candidates: [],
        error: payload
      }
    },
    [CLAIM_DEVICES_INIT]: state => {
      return {
        ...state,
        claimingDevices: true
      }
    },
    [CLAIM_DEVICES_SUCCESS]: state => {
      return {
        ...state,
        claimingDevices: false,
        claimedDevices: true
      }
    },
    [CLAIM_DEVICES_ERROR]: (state, payload) => {
      return {
        ...state,
        claimingDevices: false,
        error: payload
      }
    },
    [RESET_DISCOVERY]: () => {
      return {
        ...initialState
      }
    }
  },
  initialState
)
