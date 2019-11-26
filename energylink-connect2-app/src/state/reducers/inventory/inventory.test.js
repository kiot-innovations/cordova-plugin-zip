import * as inventoryActions from '../../actions/inventory'

import { inventoryReducer } from '.'

describe('Inventory Reducer', () => {
  const reducerTest = reducerTester(inventoryReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populates the reducer state after FETCH_INVENTORY_SUCCESS action is fired', () => {
    const bomData = {
      MODULES: 0,
      STRING_INVERTERS: 0,
      METERS: 0,
      ESS: 0,
      STORAGE_INVERTERS: 0,
      TRANSFER_SWITCHES: 0,
      BATTERIES: 0,
      GCM: 0,
      MET_STATION: 0
    }

    reducerTest(
      { bom: 'some data', fetchingInventory: false, savingInventory: false },
      inventoryActions.FETCH_INVENTORY_SUCCESS(bomData),
      { bom: bomData, fetchingInventory: false, savingInventory: false }
    )
  })
})
