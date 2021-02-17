import { miTypes, PERSIST_DATA_PATH, headersToObj } from './utils'
import { equals } from 'ramda'

describe("The variables that shouldn't change", () => {
  it('should not change, PERSIST DATA PATH', function() {
    expect(PERSIST_DATA_PATH).toMatchSnapshot()
  })
  it('should not change the MI Types', function() {
    expect(miTypes).toMatchSnapshot()
  })
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
