import { createReducer } from 'redux-act'
import {
  UPDATE_COST_SAVING_INIT,
  UPDATE_COST_SAVING_SUCCESS,
  UPDATE_SOLAR_SELF_SUPPLY_INIT,
  UPDATE_SOLAR_SELF_SUPPLY_SUCCESS,
  UPDATE_BACKUP_MAX_DAYS_INIT,
  UPDATE_BACKUP_MAX_DAYS_SUCCESS,
  UPDATE_OPERATION_MODE_INIT,
  UPDATE_OPERATION_MODE_SUCCESS,
  START_BACKUP_SUCCESS,
  START_BACKUP_INIT,
  OPERATION_MODES
} from '../../actions/storage'
import { LOGOUT } from '../../actions/auth'

const initialState = {
  selectedCostSavingId: 1,
  selectedSolarSelfSupplyId: 1,
  selectedBatteryReserves: 1,
  selectedMode: OPERATION_MODES.STORAGE_COST_SAVING,
  isUpdatingBatteryReserves: false,
  isUpdatingCostSaving: false,
  isUpdatingSolarSelfSupply: false,
  isUpdatingSeletedMode: false
}

export const storageReducer = createReducer(
  {
    [UPDATE_COST_SAVING_INIT]: state => ({
      ...state,
      isUpdatingCostSaving: true
    }),
    [UPDATE_COST_SAVING_SUCCESS]: (state, payload) => ({
      ...state,
      selectedCostSavingId: payload,
      isUpdatingCostSaving: false
    }),
    [UPDATE_SOLAR_SELF_SUPPLY_INIT]: state => ({
      ...state,
      isUpdatingSolarSelfSupply: true
    }),
    [UPDATE_SOLAR_SELF_SUPPLY_SUCCESS]: (state, payload) => ({
      ...state,
      selectedSolarSelfSupplyId: payload,
      isUpdatingSolarSelfSupply: false
    }),
    [UPDATE_BACKUP_MAX_DAYS_INIT]: (state, payload) => ({
      ...state,
      isUpdatingBackupMaxDays: true
    }),
    [UPDATE_BACKUP_MAX_DAYS_SUCCESS]: (state, payload) => ({
      ...state,
      selectedBackupMaxDays: payload,
      isUpdatingBackupMaxDays: false
    }),
    [UPDATE_OPERATION_MODE_INIT]: (state, payload) => ({
      ...state,
      isUpdatingSeletedMode: true
    }),
    [UPDATE_OPERATION_MODE_SUCCESS]: (state, payload) => ({
      ...state,
      selectedMode: parseInt(payload),
      isUpdatingSeletedMode: false
    }),
    [START_BACKUP_INIT]: (state, payload) => ({
      ...state
    }),
    [START_BACKUP_SUCCESS]: (state, payload) => ({
      ...state
    }),
    [LOGOUT]: () => initialState
  },
  initialState
)
