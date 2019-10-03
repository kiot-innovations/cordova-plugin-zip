import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import * as i18n from '../../shared/i18n'
import SignupPassword from '.'
import paths from '../Router/paths'

describe('SignupPassword page', () => {
  const previousLocation = {
    state: {
      signUpState: {
        name: 'random name',
        phoneNumber: '12345123',
        email: 'email@email.com',
        serial: '1234',
        termsAgree: true
      }
    }
  }

  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(jest.fn)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(<SignupPassword location={previousLocation} />)
    expect(component).toMatchSnapshot()
  })

  it('redirects if we are logged in', () => {
    const component = shallow(
      <SignupPassword location={previousLocation} isLoggedIn="true" />
    )
    expect(component).toMatchSnapshot()
  })

  it("redirects if we don't have a previous signup state", () => {
    const component = shallow(<SignupPassword location={{ state: {} }} />)
    expect(component).toMatchSnapshot()
  })

  it('displays an error if we submit without filling', () => {
    const { component } = mountWithProvider(
      <SignupPassword location={previousLocation} />
    )({})

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(3)
  })

  it('displays an error if we submit without filling the password', () => {
    const { component } = mountWithProvider(
      <SignupPassword location={previousLocation} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: 'my password' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(3)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('displays an error if we submit without filling the second password', () => {
    const { component } = mountWithProvider(
      <SignupPassword location={previousLocation} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: 'Another2000' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(2)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('displays an error if we submit an invalid formatted password', () => {
    const { component } = mountWithProvider(
      <SignupPassword location={previousLocation} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: 'random password' } })
    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD2"]')
      .simulate('change', { target: { value: 'random password' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(2)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('displays an error if we submit without accept agreements', () => {
    const { component } = mountWithProvider(
      <SignupPassword location={previousLocation} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: 'Randompassword12' } })
    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD2"]')
      .simulate('change', { target: { value: 'Randompassword12' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(1)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('redirects properly when submitting', () => {
    const mockHistory = {
      push: jest.fn()
    }

    const { component } = mountWithProvider(
      <SignupPassword location={previousLocation} history={mockHistory} />
    )({})

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD1"]')
      .simulate('change', { target: { value: 'Randompass123' } })
    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD2"]')
      .simulate('change', { target: { value: 'Randompass123' } })
    component
      .find('.terms-agreement input')
      .simulate('change', { target: { value: true } })

    component.find('form').simulate('submit')

    expect(mockHistory.push).toBeCalledWith({
      pathname: paths.SIGNUP_LOADER,
      state: {
        signUpState: {
          name: 'random name',
          phoneNumber: '12345123',
          email: 'email@email.com',
          serial: '1234',
          password: 'Randompass123',
          retypePassword: 'Randompass123',
          termsAgree: true
        }
      }
    })
  })
})
