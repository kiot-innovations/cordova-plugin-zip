import { createAction } from 'redux-act'

export const OPERATION_MODES = {
  STORAGE_BACKUP_ONLY: 1,
  STORAGE_COST_SAVING: 2,
  STORAGE_SOLAR_SELF_SUPPLY: 3
}

export const UPDATE_COST_SAVING_INIT = createAction('UPDATE_COST_SAVING_INIT')
export const UPDATE_COST_SAVING_SUCCESS = createAction(
  'UPDATE_COST_SAVING_SUCCESS'
)
export const UPDATE_COST_SAVING_ERROR = createAction('UPDATE_COST_SAVING_ERROR')

export const setCostSaving = optionId => {
  return dispatch => {
    try {
      dispatch(UPDATE_COST_SAVING_INIT())
      dispatch(UPDATE_COST_SAVING_SUCCESS(optionId))
    } catch (err) {
      dispatch(UPDATE_COST_SAVING_ERROR(err))
    }
  }
}

export const UPDATE_SOLAR_SELF_SUPPLY_INIT = createAction(
  'UPDATE_SOLAR_SELF_SUPPLY_INIT'
)
export const UPDATE_SOLAR_SELF_SUPPLY_SUCCESS = createAction(
  'UPDATE_SOLAR_SELF_SUPPLY_SUCCESS'
)
export const UPDATE_SOLAR_SELF_SUPPLY_ERROR = createAction(
  'UPDATE_SOLAR_SELF_SUPPLY_ERROR'
)

export const setSolarSelfSupply = optionId => {
  return dispatch => {
    try {
      dispatch(UPDATE_SOLAR_SELF_SUPPLY_INIT())
      dispatch(UPDATE_SOLAR_SELF_SUPPLY_SUCCESS(optionId))
    } catch (err) {
      dispatch(UPDATE_SOLAR_SELF_SUPPLY_ERROR(err))
    }
  }
}

export const UPDATE_BACKUP_MAX_DAYS_INIT = createAction(
  'UPDATE_BACKUP_MAX_DAYS_INIT'
)
export const UPDATE_BACKUP_MAX_DAYS_SUCCESS = createAction(
  'UPDATE_BACKUP_MAX_DAYS_SUCCESS'
)
export const UPDATE_BACKUP_MAX_DAYS_ERROR = createAction(
  'UPDATE_BACKUP_MAX_DAYS_ERROR'
)

export const setBackupMaxDays = optionId => {
  return dispatch => {
    try {
      dispatch(UPDATE_BACKUP_MAX_DAYS_INIT())
      dispatch(UPDATE_BACKUP_MAX_DAYS_SUCCESS(optionId))
    } catch (err) {
      dispatch(UPDATE_BACKUP_MAX_DAYS_ERROR(err))
    }
  }
}

export const UPDATE_OPERATION_MODE_INIT = createAction(
  'UPDATE_OPERATION_MODE_INIT'
)
export const UPDATE_OPERATION_MODE_SUCCESS = createAction(
  'UPDATE_OPERATION_MODE_SUCCESS'
)
export const UPDATE_OPERATION_MODE_ERROR = createAction(
  'UPDATE_OPERATION_MODE_ERROR'
)

export const setOperationMode = optionId => {
  return dispatch => {
    try {
      dispatch(UPDATE_OPERATION_MODE_INIT())
      dispatch(UPDATE_OPERATION_MODE_SUCCESS(optionId))
    } catch (err) {
      dispatch(UPDATE_OPERATION_MODE_ERROR(err))
    }
  }
}

export const START_BACKUP_INIT = createAction('START_BACKUP_INIT')
export const START_BACKUP_SUCCESS = createAction('START_BACKUP_SUCCESS')
export const START_BACKUP_ERROR = createAction('START_BACKUP_ERROR')

export const startBackup = () => {
  return dispatch => {
    try {
      dispatch(START_BACKUP_INIT())
      dispatch(START_BACKUP_SUCCESS())
    } catch (err) {
      dispatch(START_BACKUP_ERROR(err))
    }
  }
}
