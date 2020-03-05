import { prop } from 'ramda'
import { createReducer } from 'redux-act'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_INIT,
  FIRMWARE_UPDATE_POLLING,
  FIRMWARE_UPDATE_WAITING_FOR_NETWORK,
  RESET_FIRMWARE_UPDATE
} from 'state/actions/firmwareUpdate'

const initialState = {
  status: '',
  percent: 0,
  upgrading: false
}

const getState = prop('STATE')
const getPercent = prop('PERCENT')

export default createReducer(
  {
    [FIRMWARE_UPDATE_INIT]: () => ({
      ...initialState,
      status: 'UPLOADING_FS',
      upgrading: true
    }),
    [FIRMWARE_UPDATE_POLLING]: (state, payload) => ({
      ...initialState,
      ...state,
      status: getState(payload),
      percent: getPercent(payload)
    }),
    [FIRMWARE_UPDATE_WAITING_FOR_NETWORK]: state => ({
      ...initialState,
      ...state,
      status: 'WAITING_FOR_NETWORK',
      percent: 100
    }),
    [FIRMWARE_UPDATE_COMPLETE]: () => ({
      ...initialState,
      status: 'UPGRADE_COMPLETE',
      upgrading: false,
      canContinue: true
    }),
    [RESET_FIRMWARE_UPDATE]: () => initialState,
    [FIRMWARE_GET_VERSION_COMPLETE]: () => ({
      ...initialState,
      canContinue: true
    })
  },
  initialState
)
