import { isFloatNumber } from './isFloatNumber'

describe('isFloatNumber function', () => {
  it('should be true for floats 123.56', () => {
    const result = isFloatNumber(123.56)

    expect(result).toEqual(true)
  })
  it('should be true for integers 123', () => {
    const result = isFloatNumber(123)

    expect(result).toEqual(true)
  })
  it('should be true for parseable strings "123.56"', () => {
    const result = isFloatNumber('123.56')

    expect(result).toEqual(true)
  })
  it('should be true for parseable strings "123.56V"', () => {
    const result = isFloatNumber('123.56V')

    expect(result).toEqual(true)
  })
  it('should be false for non-parseable strings "Standby"', () => {
    const result = isFloatNumber('Standby')

    expect(result).toEqual(false)
  })
})
