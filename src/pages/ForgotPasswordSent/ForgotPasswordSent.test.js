import React from 'react'
import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import ForgotPasswordSent from '.'
import paths from '../Router/paths'
import * as i18n from '../../shared/i18n'
import * as authActions from '../../state/actions/auth'

describe('ForgotPasswordSent page', () => {
  const mockHistory = {
    push: jest.fn()
  }
  const email = 'email@sunpower.com'
  const mockLocation = {
    state: {
      email
    }
  }
  let sendMailSpy
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    sendMailSpy = jest.spyOn(authActions, 'sendResetPasswordEmail')
  })

  it('renders without crashing', () => {
    const component = shallow(<ForgotPasswordSent />)
    expect(component).toMatchSnapshot()
  })

  it('redirects if we are logged in', () => {
    const component = shallow(<ForgotPasswordSent isLoggedIn="true" />)
    expect(component).toMatchSnapshot()
  })

  it('resends the email', async () => {
    sendMailSpy.mockReturnValue({ status: 200 })
    const { component } = mountWithProvider(
      <ForgotPasswordSent history={mockHistory} location={mockLocation} />
    )({})

    await act(async () => {
      component.find('span.link').simulate('click')
    })
    expect(authActions.sendResetPasswordEmail).toBeCalledWith(email)
    expect(mockHistory.push).toBeCalledWith({
      pathname: paths.FORGOT_PASSWORD_SENT,
      state: {
        email,
        isResend: true
      }
    })
  })
})
