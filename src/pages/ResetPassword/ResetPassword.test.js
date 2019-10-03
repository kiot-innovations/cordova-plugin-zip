import React from 'react'
import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import * as reactRedux from 'react-redux'
import * as authActions from '../../state/actions/auth'
import * as i18n from '../../shared/i18n'
import ResetPassword from '.'

describe('ResetPassword page', () => {
  let dispatchMock
  let resetPasswordSpy
  let validatePackageSpy
  const match = {
    params: {
      pkg: '12345-567890'
    }
  }
  const mockHistory = {
    push: jest.fn()
  }
  beforeEach(() => {
    dispatchMock = jest.fn()

    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
    resetPasswordSpy = jest.spyOn(authActions, 'resetPassword')
    validatePackageSpy = jest.spyOn(authActions, 'validatePackage')
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(
      <ResetPassword history={mockHistory} match={match} />
    )
    expect(component).toMatchSnapshot()
  })

  it('redirects if we are logged in', () => {
    const component = shallow(
      <ResetPassword history={mockHistory} match={match} isLoggedIn="true" />
    )
    expect(component).toMatchSnapshot()
  })

  it("redirects if we don't have a pkg param", () => {
    const component = shallow(
      <ResetPassword history={mockHistory} match={{ params: {} }} />
    )
    expect(component).toMatchSnapshot()
  })

  it('displays an error if we submit without filling', () => {
    const { component } = mountWithProvider(
      <ResetPassword history={mockHistory} match={match} />
    )({})

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(3)
  })

  it('displays an error if we submit without filling the password', () => {
    const { component } = mountWithProvider(
      <ResetPassword history={mockHistory} match={match} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_CONFIRM_EMAIL"]')
      .simulate('change', { target: { value: 'sun@power.com' } })

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: 'my password' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(2)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('displays an error if we submit without filling the second password', () => {
    const { component } = mountWithProvider(
      <ResetPassword history={mockHistory} match={match} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_CONFIRM_EMAIL"]')
      .simulate('change', { target: { value: 'sun@power.com' } })

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: 'Another2000' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(1)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('displays an error if we submit an invalid formatted password', () => {
    const { component } = mountWithProvider(
      <ResetPassword history={mockHistory} match={match} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_CONFIRM_EMAIL"]')
      .simulate('change', { target: { value: 'sun@power.com' } })
    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: 'random password' } })
    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD2"]')
      .simulate('change', { target: { value: 'random password' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(1)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('resets password and login', async () => {
    validatePackageSpy.mockReturnValue({ status: 200 })
    resetPasswordSpy.mockReturnValue({ status: 200 })

    const { component } = mountWithProvider(
      <ResetPassword history={mockHistory} match={match} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_CONFIRM_EMAIL"]')
      .simulate('change', { target: { value: 'sun@power.com' } })
    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: '12Sunpower34' } })
    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD2"]')
      .simulate('change', { target: { value: '12Sunpower34' } })
    component
      .find('input[type="checkbox"]')
      .simulate('change', { target: { value: true } })

    await act(async () => {
      component.find('form').simulate('submit')
    })
    expect(authActions.resetPassword).toBeCalledWith(
      {
        email: 'sun@power.com',
        password: '12Sunpower34',
        retypePassword: '12Sunpower34',
        termsAgree: true
      },
      '12345-567890'
    )
  })
})
