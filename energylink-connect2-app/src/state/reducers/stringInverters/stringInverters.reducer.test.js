import stringInverterReducer, { initialState } from './index'

import { FETCH_MODELS_SUCCESS } from 'state/actions/devices'
import { SAVE_STRING_INVERTERS } from 'state/actions/stringInverters'

describe('The stringInverterReducer', function() {
  const reducerTest = reducerTester(stringInverterReducer)
  describe('The initial state', function() {
    it('should not change', function() {
      expect(initialState).toMatchSnapshot()
    })
  })
  it('should get a new state with SAVE_STRING_INVERTERS', function() {
    const newDevices = [
      { serialNumber: '123', moduleCount: '2' },
      { serialNumber: '234', moduleCount: '2' }
    ]
    reducerTest(initialState, SAVE_STRING_INVERTERS(newDevices), {
      ...initialState,
      newDevices
    })
  })
  it('should get a new state with FETCH_MODELS_SUCCESS', function() {
    const responseCall = {
      A: ['SPR-240E-WHT-U ACPV', 'SPR-245NE-WHT-U-240 ACPV'],
      B: ['SPR-E20-245-B-AC', 'SPR-X20-250-BLK AC'],
      C: [
        'SPR-E19-320-C-AC',
        'SPR-E20-327-C-AC',
        'SPR-X21-335-BLK-C-AC',
        'SPR-X21-335-C-AC',
        'SPR-X21-345-C-AC',
        'SPR-X22-360-C-AC'
      ],
      D: [
        'SPR-E20-327-D-AC',
        'SPR-X19-315-D-AC',
        'SPR-X20-327-BLK-D-AC',
        'SPR-X20-327-D-AC',
        'SPR-X21-335-BLK-D-AC',
        'SPR-X21-335-D-AC',
        'SPR-X21-345-D-AC',
        'SPR-X21-350-BLK-D-AC',
        'SPR-X22-360-D-AC',
        'SPR-X22-370-D-AC',
        'SPR-240E-WHT-D AR'
      ],
      E: [
        'SPR-E19-320-E-AC',
        'SPR-E20-327-E-AC',
        'SPR-X20-327-BLK-E-AC',
        'SPR-X20-327-E-AC',
        'SPR-X21-335-BLK-E-AC',
        'SPR-X21-335-E-AC',
        'SPR-X21-345-E-AC',
        'SPR-X21-350-BLK-E-AC',
        'SPR-X22-360-E-AC',
        'SPR-X22-370-E-AC',
        'SPR-X21-355-E-AC'
      ],
      G: [
        'SPR-A390-G-AC',
        'SPR-A400-G-AC',
        'SPR-A410-G-AC',
        'SPR-A415-G-AC',
        'SPR-A420-G-AC',
        'SPR-A390-BLK-G-AC',
        'SPR-A400-BLK-G-AC'
      ],
      H: [
        'SPR-A390-H-AC',
        'SPR-A400-H-AC',
        'SPR-A410-H-AC',
        'SPR-A415-H-AC',
        'SPR-A420-H-AC',
        'SPR-A390-BLK-H-AC',
        'SPR-A400-BLK-H-AC'
      ],
      'V1.0': ['SPR-225E-BLK-U ACPV'],
      //these are not string inverter modules, they're model strings that represent solar panels that are attached to string inverters
      stringInverters: initialState.models
    }
    reducerTest(initialState, FETCH_MODELS_SUCCESS(responseCall), {
      ...initialState,
      models: responseCall.stringInverters
    })
  })
})
