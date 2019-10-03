import React from 'react'
import { shallow } from 'enzyme'
import ForgotPasswordFailed from '.'
import * as i18n from '../../shared/i18n'

describe('ForgotPasswordFailed page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(<ForgotPasswordFailed />)
    expect(component).toMatchSnapshot()
  })

  it('redirects if we are logged in', () => {
    const component = shallow(<ForgotPasswordFailed isLoggedIn="true" />)
    expect(component).toMatchSnapshot()
  })
})
