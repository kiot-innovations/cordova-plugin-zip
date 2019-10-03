import * as storageActions from '../../actions/storage'
import { storageReducer } from '.'

describe('Storage reducer', () => {
  const reducerTest = reducerTester(storageReducer)
  const initialState = {
    selectedCostSavingId: 1,
    selectedSolarSelfSupplyId: 1,
    selectedBackupMaxDays: 1,
    isUpdatingCostSaving: false,
    isUpdatingSolarSelfSupply: false,
    isUpdatingBackupMaxDays: false,
    isUpdatingSeletedMode: false
  }
  it('returns the initial state', () => {
    reducerTest(
      initialState,
      {},
      {
        ...initialState
      }
    )
  })

  it('changes selected cost saving id when UPDATE_COST_SAVING_SUCCESS action is fired', () => {
    reducerTest(initialState, storageActions.UPDATE_COST_SAVING_SUCCESS(4), {
      ...initialState,
      selectedCostSavingId: 4
    })
  })

  it('changes selected solar self supply id when UPDATE_COST_SAVING_SUCCESS action is fired', () => {
    reducerTest(
      initialState,
      storageActions.UPDATE_SOLAR_SELF_SUPPLY_SUCCESS(3),
      {
        ...initialState,
        selectedSolarSelfSupplyId: 3
      }
    )
  })
  it('changes selected solar backup max days when UPDATE_BACKUP_MAX_DAYS_SUCCESS action is fired', () => {
    reducerTest(
      initialState,
      storageActions.UPDATE_BACKUP_MAX_DAYS_SUCCESS(4),
      {
        ...initialState,
        selectedBackupMaxDays: 4
      }
    )
  })

  it('changes selected solar backup max days when UPDATE_OPERATION_MODE_SUCCESS action is fired', () => {
    reducerTest(
      initialState,
      storageActions.UPDATE_OPERATION_MODE_SUCCESS(
        storageActions.OPERATION_MODES.STORAGE_BACKUP_ONLY
      ),
      {
        ...initialState,
        selectedMode: storageActions.OPERATION_MODES.STORAGE_BACKUP_ONLY
      }
    )
  })
})
