import { prop } from 'ramda'
import { createReducer } from 'redux-act'
import {
  FIRMWARE_GET_VERSION_COMPLETE,
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_UPDATE_INIT,
  FIRMWARE_UPDATE_POLLING,
  FIRMWARE_UPDATE_WAITING_FOR_NETWORK,
  FIRMWARE_SET_LAST_SUCCESSFUL_STAGE,
  GRID_PROFILE_UPLOAD_ERROR,
  RESET_FIRMWARE_UPDATE,
  SET_FIRMWARE_RELEASE_NOTES,
  GRID_PROFILE_UPLOAD_INIT,
  GRID_PROFILE_UPLOAD_COMPLETE
} from 'state/actions/firmwareUpdate'

const initialState = {
  percent: 0,
  status: '',
  upgrading: false,
  versionBeforeUpgrade: 0,
  lastSuccessfulStage: -1
}

const getState = prop('STATE')
const getPercent = prop('PERCENT')

export const fwupStatus = {
  UPLOADING_FS: 'UPLOADING_FS',
  WAITING_FOR_NETWORK: 'WAITING_FOR_NETWORK',
  UPGRADE_COMPLETE: 'UPGRADE_COMPLETE',
  ERROR: 'ERROR',
  UPLOADING_GRID_PROFILES: 'UPLOADING_GRID_PROFILES',
  GRID_PROFILES_UPLOADED: 'GRID_PROFILES_UPLOADED',
  ERROR_GRID_PROFILE: 'ERROR_GRID_PROFILE'
}

export default createReducer(
  {
    [FIRMWARE_UPDATE_INIT]: (state, { PVSFromVersion }) => ({
      ...initialState,
      status: fwupStatus.UPLOADING_FS,
      upgrading: true,
      versionBeforeUpgrade: PVSFromVersion
    }),
    [FIRMWARE_UPDATE_POLLING]: (state, payload) => ({
      ...state,
      status: getState(payload),
      percent: getPercent(payload)
    }),
    [FIRMWARE_UPDATE_WAITING_FOR_NETWORK]: state => ({
      ...state,
      status: fwupStatus.WAITING_FOR_NETWORK,
      percent: 100,
      canContinue: true
    }),
    [FIRMWARE_SET_LAST_SUCCESSFUL_STAGE]: (state, lastSuccessfulStage) => ({
      ...state,
      lastSuccessfulStage
    }),
    [FIRMWARE_UPDATE_COMPLETE]: () => ({
      ...initialState,
      status: fwupStatus.UPGRADE_COMPLETE,
      upgrading: false,
      canContinue: true
    }),
    [GRID_PROFILE_UPLOAD_INIT]: () => ({
      ...initialState,
      status: fwupStatus.UPLOADING_GRID_PROFILES
    }),
    [GRID_PROFILE_UPLOAD_COMPLETE]: () => ({
      ...initialState,
      status: fwupStatus.GRID_PROFILES_UPLOADED
    }),
    [FIRMWARE_UPDATE_ERROR]: state => ({
      ...initialState,
      ...state,
      upgrading: false,
      status: fwupStatus.ERROR,
      canContinue: true
    }),
    [GRID_PROFILE_UPLOAD_ERROR]: state => ({
      ...initialState,
      ...state,
      status: fwupStatus.ERROR_GRID_PROFILE
    }),
    [RESET_FIRMWARE_UPDATE]: () => ({ ...initialState, canContinue: true }),
    [FIRMWARE_GET_VERSION_COMPLETE]: ({ versionBeforeUpgrade }) => ({
      ...initialState,
      canContinue: true,
      versionBeforeUpgrade
    }),
    [SET_FIRMWARE_RELEASE_NOTES]: (state, releaseNotes) => ({
      ...state,
      releaseNotes
    })
  },
  initialState
)
