import { __, assocPath, countBy, map, test } from 'ramda'
import * as rxjs from 'rxjs'
import { of } from 'rxjs'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'
import { SET_PVS_MODEL } from 'state/actions/pvs'
import setPVSModelEpic, {
  isPvsRegex,
  getPvsModelFromResponse
} from '../setPVSModelEpic'
describe('The setPVS Model Epic', function() {
  beforeEach(function() {
    jest.spyOn(rxjs, 'from').mockImplementation(() => of('PVS6'))
  })
  it('should launch a SET_MODEL', function() {
    const epicTest = epicTester(setPVSModelEpic)
    const inputValues = {
      l: PVS_CONNECTION_SUCCESS()
    }
    const expectedValue = {
      m: SET_PVS_MODEL('PVS6')
    }
    const inputMarble = '(l)'
    const expectedMarble = '(m)'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValue)
  })
})

describe('The setPvsModelEpic utilities', function() {
  it('should have the correct regex', function() {
    const stringTests = [
      //True(6)
      'pvs5',
      'pvs6',
      'pvs7',
      'pVs2',
      'PVS1',
      'pvs10000',
      // false (2)
      'pvs',
      'Weird model'
    ]
    const results = countBy(Boolean, map(test(isPvsRegex), stringTests))
    expect(results).toStrictEqual({ false: 2, true: 6 })
  })
  const setModel = assocPath(['supervisor', 'MODEL'], __, {})
  it('should getTheModelCorrectly', function() {
    const pvs5c = setModel('PV Supervisor PVS5c')
    expect(getPvsModelFromResponse(pvs5c)).toBe('PVS5')
    const pvs5 = setModel('PV Supervisor PVS5')
    expect(getPvsModelFromResponse(pvs5)).toBe('PVS5')
    const pvs6 = setModel('PV Supervisor PVS6')
    expect(getPvsModelFromResponse(pvs6)).toBe('PVS6')
    const pvs7 = setModel('PV Supervisor PVS7')
    expect(getPvsModelFromResponse(pvs7)).toBe('PVS7')
    const unknown = setModel("I don't know")
    expect(getPvsModelFromResponse(unknown)).toBe('Unknown Model')
  })
})
