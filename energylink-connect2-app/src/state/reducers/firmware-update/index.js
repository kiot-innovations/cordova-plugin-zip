import { prop } from 'ramda'
import { createReducer } from 'redux-act'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_UPDATE_INIT,
  FIRMWARE_UPDATE_POLLING,
  FIRMWARE_UPDATE_WAITING_FOR_NETWORK,
  GRID_PROFILE_UPLOAD_ERROR,
  RESET_FIRMWARE_UPDATE
} from 'state/actions/firmwareUpdate'

const initialState = {
  percent: 0,
  status: '',
  upgrading: false,
  versionBeforeUpgrade: 0
}

const getState = prop('STATE')
const getPercent = prop('PERCENT')

export default createReducer(
  {
    [FIRMWARE_UPDATE_INIT]: (state, { PVSversion }) => ({
      ...initialState,
      status: 'UPLOADING_FS',
      upgrading: true,
      versionBeforeUpgrade: PVSversion
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
    [FIRMWARE_UPDATE_ERROR]: state => ({
      ...initialState,
      ...state,
      upgrading: false,
      status: 'ERROR'
    }),
    [GRID_PROFILE_UPLOAD_ERROR]: state => ({
      ...initialState,
      ...state,
      status: 'ERROR'
    }),
    [RESET_FIRMWARE_UPDATE]: () => initialState,
    [FIRMWARE_GET_VERSION_COMPLETE]: ({ versionBeforeUpgrade }) => ({
      ...initialState,
      canContinue: true,
      versionBeforeUpgrade
    })
  },
  initialState
)
