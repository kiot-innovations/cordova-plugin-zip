import { trimObject } from './trim'

describe('Trim object function', () => {
  it('Should trim email', () => {
    const email = 'sun@power.com'
    const password = '1234567890'
    const testObj = {
      email: `  ${email} `,
      password
    }
    const expected = {
      email,
      password
    }

    expect(trimObject(testObj)).toEqual(expected)
  })

  it('Should trim only strings', () => {
    const email = 'sun@power.com'
    const password = '1234567890'
    const rememeberme = true
    const testObj = {
      email: `  ${email} `,
      password,
      rememeberme
    }
    const expected = {
      email,
      password,
      rememeberme
    }

    expect(trimObject(testObj)).toEqual(expected)
  })
})
