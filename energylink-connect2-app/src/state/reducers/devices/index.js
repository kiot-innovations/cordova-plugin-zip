import { createReducer } from 'redux-act'
import {
  DISCOVER_COMPLETE,
  DISCOVER_INIT,
  DISCOVER_UPDATE
} from 'state/actions/devices'

const initialState = {
  isFetching: false,
  found: {},
  error: ''
}

const parseDeviceData = devices =>
  devices.reduce(
    (acc, curr) => ({ [curr.TYPE.toLowerCase()]: curr.NFOUND, ...acc }),
    {}
  )

export default createReducer(
  {
    [DISCOVER_INIT]: state => ({ ...state, isFetching: true }),
    [DISCOVER_UPDATE]: (state, devices) => {
      return {
        ...state,
        found: devices ? parseDeviceData(devices) : state.found
      }
    },
    [DISCOVER_COMPLETE]: (state, devices) => {
      return {
        ...state,
        isFetching: false,
        found: devices ? parseDeviceData(devices) : state.found
      }
    }
  },
  initialState
)
