import { prop } from 'ramda'
import { createReducer } from 'redux-act'

import {
  NO_FIRMWARE_UPDATE_AVAILABLE,
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_ERROR,
  INIT_FIRMWARE_UPDATE,
  POLL_FIRMWARE_UPDATE,
  WAIT_FOR_NETWORK_AFTER_FIRMWARE_UPDATE,
  FIRMWARE_SET_LAST_SUCCESSFUL_STAGE,
  RESET_FIRMWARE_UPDATE,
  SET_FIRMWARE_RELEASE_NOTES,
  INIT_GRID_PROFILE_UPLOAD,
  GRID_PROFILE_UPLOAD_COMPLETE,
  GRID_PROFILE_UPLOAD_ERROR
} from 'state/actions/firmwareUpdate'

const initialState = {
  percent: 0,
  status: '',
  upgrading: false,
  versionBeforeUpgrade: 0,
  lastSuccessfulStage: -1,
  canContinue: true
}

const getState = prop('STATE')
const getPercent = prop('PERCENT')

// PVS5 GetFWUpgradeStatus response is different
const getDlPercent = prop('DL_PERCENT')

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
    [INIT_FIRMWARE_UPDATE]: ({ versionBeforeUpgrade }, { PVSFromVersion }) => ({
      ...initialState,
      status: fwupStatus.UPLOADING_FS,
      upgrading: true,
      canContinue: false,
      versionBeforeUpgrade: PVSFromVersion
        ? PVSFromVersion
        : versionBeforeUpgrade
    }),
    [POLL_FIRMWARE_UPDATE]: (state, payload) => ({
      ...state,
      status: getState(payload),
      percent: getPercent(payload) || getDlPercent(payload),
      canContinue: false
    }),
    [WAIT_FOR_NETWORK_AFTER_FIRMWARE_UPDATE]: state => ({
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
    [INIT_GRID_PROFILE_UPLOAD]: state => ({
      ...state,
      status: fwupStatus.UPLOADING_GRID_PROFILES
    }),
    [GRID_PROFILE_UPLOAD_COMPLETE]: state => ({
      ...state,
      status: fwupStatus.GRID_PROFILES_UPLOADED
    }),
    [GRID_PROFILE_UPLOAD_ERROR]: state => ({
      ...state,
      status: fwupStatus.ERROR_GRID_PROFILE
    }),
    [FIRMWARE_UPDATE_ERROR]: state => ({
      ...state,
      upgrading: false,
      status: fwupStatus.ERROR,
      canContinue: true
    }),
    [RESET_FIRMWARE_UPDATE]: () => ({ ...initialState, canContinue: true }),
    [NO_FIRMWARE_UPDATE_AVAILABLE]: ({ versionBeforeUpgrade }) => ({
      ...initialState,
      versionBeforeUpgrade
    }),
    [SET_FIRMWARE_RELEASE_NOTES]: (state, releaseNotes) => ({
      ...state,
      releaseNotes
    })
  },
  initialState
)
