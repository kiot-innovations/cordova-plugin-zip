import React from 'react'
import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import ForgotPassword from '.'
import paths from '../Router/paths'
import * as i18n from '../../shared/i18n'
import * as authActions from '../../state/actions/auth'

describe('ForgotPassword page', () => {
  const mockHistory = {
    push: jest.fn()
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
    const component = shallow(<ForgotPassword />)
    expect(component).toMatchSnapshot()
  })

  it('redirects if we are logged in', () => {
    const component = shallow(<ForgotPassword isLoggedIn="true" />)
    expect(component).toMatchSnapshot()
  })

  it('displays an error if we submit without filling email', () => {
    const { component } = mountWithProvider(<ForgotPassword />)({})

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(1)
  })

  it('redirects properly when submitting', async () => {
    sendMailSpy.mockReturnValue({ status: 200 })
    const email = 'email@email.com'

    const { component } = mountWithProvider(
      <ForgotPassword history={mockHistory} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_EMAIL"]')
      .simulate('change', { target: { value: email } })

    await act(async () => {
      component.find('form').simulate('submit')
    })
    expect(authActions.sendResetPasswordEmail).toBeCalledWith(email)
    expect(mockHistory.push).toBeCalledWith({
      pathname: paths.FORGOT_PASSWORD_SENT,
      state: {
        email
      }
    })
  })

  it('redirects properly when email not found', async () => {
    sendMailSpy.mockReturnValue({ status: 404 })
    const email = 'email@email.com'

    const { component } = mountWithProvider(
      <ForgotPassword history={mockHistory} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_EMAIL"]')
      .simulate('change', { target: { value: email } })

    await act(async () => {
      component.find('form').simulate('submit')
    })

    expect(authActions.sendResetPasswordEmail).toBeCalledWith(email)
    expect(mockHistory.push).toBeCalledWith({
      pathname: paths.FORGOT_PASSWORD_FAILED,
      state: {
        email
      }
    })
  })

  it('redirects properly when fetch failed', async () => {
    sendMailSpy.mockImplementation(() => {
      throw { status: 500, message: 'Internal server error' }
    })
    const email = 'email@email.com'

    const { component } = mountWithProvider(
      <ForgotPassword history={mockHistory} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_EMAIL"]')
      .simulate('change', { target: { value: email } })

    await act(async () => {
      component.find('form').simulate('submit')
    })

    expect(authActions.sendResetPasswordEmail).toBeCalledWith(email)
    expect(mockHistory.push).toBeCalledWith({
      pathname: paths.FORGOT_PASSWORD_FAILED,
      state: {
        error: {
          status: 500,
          message: 'Internal server error'
        }
      }
    })
  })
})
