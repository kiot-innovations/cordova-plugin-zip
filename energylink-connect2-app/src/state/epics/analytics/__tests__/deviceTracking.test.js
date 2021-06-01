import * as utils from 'shared/utils'
import {
  getTimePassedState,
  isInverter,
  isMeter,
  isProductionMeter,
  parseDevicesObject
} from '../deviceTracking'
import { identity, propOr } from 'ramda'

describe('The device tracking utilities', () => {
  beforeEach(() => {
    jest.spyOn(utils, 'getElapsedTime').mockImplementation(() => 10)
  })
  it('should get the time passed accurately', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1)
    jest.spyOn(utils, 'getElapsedTime').mockImplementation(identity)
    expect(
      getTimePassedState('hello', {
        analytics: {
          claimingDevices: {
            hello: 10
          }
        }
      })
    ).toBe(10)
  })
  it('should get the production meter correctly', () => {
    expect(
      isProductionMeter({
        MODEL: '1234567890p'
      })
    ).toBe(true)
    expect(
      isProductionMeter({
        MODEL: '1234567890P'
      })
    ).toBe(true)
    expect(
      isProductionMeter({
        MODEL: '1234567890c'
      })
    ).toBe(false)
    expect(
      isProductionMeter({
        MODEL: '1234567890C'
      })
    ).toBe(false)
    expect(isProductionMeter(undefined)).toBe(false)
  })
  it('should tell correcltty if it is a meter', () => {
    expect(
      isMeter({
        DEVICE_TYPE: 'Power Meter'
      })
    ).toBe(true)
    expect(
      isMeter({
        DEVICE_TYPE: 'power meter'
      })
    ).toBe(true)
    expect(
      isMeter({
        DEVICE_TYPE: 'Anything'
      })
    ).toBe(false)
  })
  it('should tell correctly if it is an Inverter', () => {
    expect(
      isInverter({
        DEVICE_TYPE: 'Inverter'
      })
    ).toBe(true)
    expect(
      isInverter({
        DEVICE_TYPE: 'inverter'
      })
    ).toBe(true)
    expect(
      isInverter({
        DEVICE_TYPE: 'Anything else'
      })
    ).toBe(false)
  })
  it('should parse correctly the devices Object', () => {
    const meter = {
      DEVICE_TYPE: 'power meter'
    }
    const inverter = {
      DEVICE_TYPE: 'inverter'
    }
    const addConsumptionToMeter = obj => ({
      ...obj,
      MODEL: propOr('1234567890', 'MODEL', obj) + 'c'
    })
    const addProdToMeter = obj => ({
      ...obj,
      MODEL: propOr('1234567890', 'MODEL', obj) + 'p'
    })
    const devices = [
      {
        ...inverter,
        SERIAL: 'qwe',
        MODEL: 'E'
      },
      {
        ...inverter,
        SERIAL: '345',
        MODEL: 'E'
      },
      {
        ...inverter,
        SERIAL: '234',
        MODEL: 'E'
      },
      {
        ...meter,
        ...addProdToMeter(),
        SERIAL: '567'
      },
      {
        ...meter,
        ...addConsumptionToMeter(),
        SERIAL: '098'
      },
      {
        ...meter,
        ...addProdToMeter(),
        SERIAL: '123'
      }
    ]
    const result = {
      consumptionMeter: ['098'],
      miClaimedSN: ['qwe', '345', '234'],
      prodMeter: ['567', '123'],
      typesMiClaimed: ['E']
    }
    expect(parseDevicesObject(devices)).toStrictEqual(result)
  })
})
