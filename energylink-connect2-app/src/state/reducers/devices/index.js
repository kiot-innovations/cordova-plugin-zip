import { createReducer } from 'redux-act'
import {
  DISCOVER_COMPLETE,
  DISCOVER_INIT,
  DISCOVER_UPDATE,
  FETCH_CANDIDATES_INIT,
  FETCH_CANDIDATES_UPDATE,
  FETCH_CANDIDATES_COMPLETE,
  FETCH_CANDIDATES_ERROR
} from 'state/actions/devices'

const initialState = {
  isFetching: false,
  found: {},
  error: '',
  isFetchingCandidates: false,
  candidates: []
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
        found: payload ? parseCompleteDevices(payload.devices) : state.found
      }
    },
    [DISCOVER_COMPLETE]: (state, payload) => {
      return {
        ...state,
        isFetching: false,
        found: payload ? parseCompleteDevices(payload.devices) : state.found
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
        candidates: payload
      }
    },
    [FETCH_CANDIDATES_COMPLETE]: (state, payload) => {
      return {
        ...state,
        candidates: payload,
        isFetchingCandidates: false
      }
    },
    [FETCH_CANDIDATES_ERROR]: (state, payload) => {
      return {
        ...state,
        isFetchingCandidates: false,
        error: payload
      }
    }
  },
  initialState
)
