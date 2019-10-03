import { PASSWORD_REGEXP, EMAIL_REGEXP, PHONE_REGEXP } from './regex'

describe('Regex function', () => {
  it('Should password regex test be true', () => {
    const password = '12Sunshine34'

    expect(PASSWORD_REGEXP.test(password)).toBeTruthy()
  })

  it('Should password regex test be false, must be at least length 8', () => {
    const password = 'Sun123'

    expect(PASSWORD_REGEXP.test(password)).toBeFalsy()
  })

  it('Should email regex test be true', () => {
    const email = 'sun@power.com'

    expect(EMAIL_REGEXP.test(email)).toBeTruthy()
  })

  it('Should email regex test be false, invalid email', () => {
    const email = 'sun@power'

    expect(EMAIL_REGEXP.test(email)).toBeFalsy()
  })

  it('Should us phone regex test with separators be true', () => {
    const phone = '1 555-555-5555'

    expect(PHONE_REGEXP.test(phone)).toBeTruthy()
  })

  it('Should us phone regex test with spaces be true', () => {
    const phone = '1 555 555 5555'

    expect(PHONE_REGEXP.test(phone)).toBeTruthy()
  })

  it('Should us phone regex test without spaces be true', () => {
    const phone = '5555555555'

    expect(PHONE_REGEXP.test(phone)).toBeTruthy()
  })

  it('Should phone regex test be false, invalid phone', () => {
    const phone = 'A555222111'

    expect(PHONE_REGEXP.test(phone)).toBeFalsy()
  })
})
