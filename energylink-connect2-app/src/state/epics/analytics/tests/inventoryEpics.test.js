import {
  parseInventory,
  parseESSValue,
  parsePropertyToNumber
} from '../InventoryEpics'
import { equals } from 'ramda'

const dataWithESS = [
  {
    item: 'AC_MODULES',
    value: '2',
    disabled: false
  },
  {
    item: 'DC_MODULES',
    value: '0',
    disabled: true
  },
  {
    item: 'STRING_INVERTERS',
    value: '0',
    disabled: true
  },
  {
    item: 'EXTERNAL_METERS',
    value: '0',
    disabled: true
  },
  {
    item: 'ESS',
    value: '26kWh (1 inverter)',
    disabled: false
  }
]

const dataWithoutESS = [
  {
    item: 'AC_MODULES',

    value: '2',
    disabled: false
  },
  {
    item: 'DC_MODULES',
    value: '0',
    disabled: true
  },
  {
    item: 'STRING_INVERTERS',
    value: '0',
    disabled: true
  },
  {
    item: 'EXTERNAL_METERS',
    value: '0',
    disabled: true
  },
  {
    item: 'ESS',
    value: '0',
    disabled: false
  }
]

describe('The helper functions', () => {
  it('should parse the inventory correctly', () => {
    const parsedInventory = parseInventory(dataWithESS)
    expect(parsedInventory).toMatchSnapshot()
    const isEqual = equals(parsedInventory, {
      AC_MODULES: 2,
      DC_MODULES: '0',
      ESS: '26kWh',
      EXTERNAL_METERS: '0',
      STRING_INVERTERS: '0'
    })
    expect(isEqual).toBe(true)
  })
  describe('The parseESSValue function', () => {
    it('should  only get the ESS without the parentehsis', () => {
      const parsedInventory = { ESS: '26kWh (1 inverter)' }
      const { ESS } = parseESSValue(parsedInventory)
      expect(ESS).toBe('26kWh')
    })
    it('should work also if there is no ESS', () => {
      const parsedInventory = { ESS: '0' }
      const { ESS } = parseESSValue(parsedInventory)
      expect(ESS).toBe('0')
    })
  })
  describe('the parsePropertyToNumber function', () => {
    it('should parse a property number to a value', () => {
      const testObj = { prop: '10' }
      const { prop } = parsePropertyToNumber('prop', testObj)
      expect(prop).toBe(10)
    })
  })
})
