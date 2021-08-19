import { equals } from 'ramda'
import { createAction } from 'redux-act'

import {
  miTypes,
  PERSIST_DATA_PATH,
  headersToObj,
  getUrl,
  isActionError,
  getElapsedTime,
  isUnknownSerialNumber
} from './utils'

describe("The variables that shouldn't change", () => {
  it('should not change, PERSIST DATA PATH', function() {
    expect(PERSIST_DATA_PATH).toMatchSnapshot()
  })
  it('should not change the MI Types', function() {
    expect(miTypes).toMatchSnapshot()
  })
})

it('should get the url', () => {
  delete window.location
  window.location = new URL('http://127.0.0.1/#/bill-of-materials')
  expect(getUrl()).toBe('/bill-of-materials')
})

describe('The headers to obj funtion', () => {
  it('should translate the headers from Headers to Obj', () => {
    const headers = new Headers()
    headers.append('one', '1')
    headers.append('two', '2')

    const parsedHeaders = headersToObj(headers)
    const expectedObj = { one: '1', two: '2' }

    expect(equals(parsedHeaders, expectedObj)).toBe(true)
  })
})
describe('The isUnknownSerialNumber helper', function() {
  it('should be a valid serial number', function() {
    const invalid = 'abc?123'
    expect(isUnknownSerialNumber(invalid)).toBe(true)
  })
  it('should be a valid serial number', function() {
    const valid = 'abc123'
    expect(isUnknownSerialNumber(valid)).toBe(false)
  })
})

describe('getElapsedTime function', () => {
  it('should report an elapsed time of 10 seconds', () => {
    // initialTimestamp = 1617369475577 Fri Apr 02 2021 07:17:55 GMT-0600 (Central Standard Time)
    // Date.now() =       1617369485577 Fri Apr 02 2021 07:18:05 GMT-0600 (Central Standard Time)
    jest.spyOn(Date, 'now').mockImplementation(() => 1617369485577)
    const elapsedTime = getElapsedTime(1617369475577)

    expect(elapsedTime).toBe(10)
  })

  it('should report an elapsed time of 0 seconds when called without initial timestamp', () => {
    // Date.now() =       1617369485577 Fri Apr 02 2021 07:18:05 GMT-0600 (Central Standard Time)
    jest.spyOn(Date, 'now').mockImplementation(() => 1617369485577)
    const elapsedTime = getElapsedTime()

    expect(elapsedTime).toBe(0)
  })

  it('should report an elapsed time of 0 seconds when called with undefined', () => {
    // Date.now() =       1617369485577 Fri Apr 02 2021 07:18:05 GMT-0600 (Central Standard Time)
    jest.spyOn(Date, 'now').mockImplementation(() => 1617369485577)
    const elapsedTime = getElapsedTime(undefined)

    expect(elapsedTime).toBe(0)
  })

  it('should report an elapsed time of 0 seconds when called with null', () => {
    // Date.now() =       1617369485577 Fri Apr 02 2021 07:18:05 GMT-0600 (Central Standard Time)
    jest.spyOn(Date, 'now').mockImplementation(() => 1617369485577)
    const elapsedTime = getElapsedTime(null)

    expect(elapsedTime).toBe(0)
  })
})

describe('Is ActionError function', function() {
  const TEST_ACTION = createAction('TEST ACTION')
  it('should return true in case the redux action is dispatches as error', function() {
    expect(isActionError(TEST_ACTION.asError({ hello: 'world' }))).toBe(true)
  })
  it('should return false in case the redux action is dispatches normally', function() {
    expect(isActionError(TEST_ACTION({ hello: 'world' }))).toBe(false)
  })
})
