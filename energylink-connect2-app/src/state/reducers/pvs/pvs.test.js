import * as pvsActions from '../../actions/pvs'

import { pvsReducer } from './index'

describe('PVS Reducer', () => {
  const reducerTest = reducerTester(pvsReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('populares the reducer state after SAVE_PVS_SN action is fired', () => {
    reducerTest({ serialNumber: '' }, pvsActions.SAVE_PVS_SN('SN123456'), {
      serialNumber: 'SN123456'
    })
  })
})
