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
    }
  },
  initialState
)
