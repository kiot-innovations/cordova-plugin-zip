import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import * as authActions from '../../state/actions/auth'
import Login from '.'
import * as i18n from '../../shared/i18n'

describe('Login page', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()

    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
    jest.spyOn(authActions, 'LOGIN_INIT').mockImplementation(jest.fn)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(<Login />)
    expect(component).toMatchSnapshot()
  })

  it('displays an error if we submit without filling', () => {
    const { component } = mountWithProvider(<Login />)({})

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(2)
  })

  it('displays an error if we submit without filling the username', () => {
    const { component } = mountWithProvider(<Login />)({})

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD"]')
      .simulate('change', { target: { value: 'random pw' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(1)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('displays an error if we submit without filling the password', () => {
    const { component } = mountWithProvider(<Login />)({})

    component
      .find('input[placeholder="PLACEHOLDER_EMAIL"]')
      .simulate('change', { target: { value: 'test@email.com' } })

    component.find('form').simulate('submit')

    expect(component.find('span.error').length).toBe(1)
    expect(component.find('span.error')).toMatchSnapshot()
  })

  it('dispatched the right action when submitting', () => {
    const { component } = mountWithProvider(<Login />)({})

    component
      .find('input[placeholder="PLACEHOLDER_EMAIL"]')
      .simulate('change', { target: { value: 'test@email.com' } })

    component
      .find('input[placeholder="PLACEHOLDER_PASSWORD"]')
      .simulate('change', { target: { value: 'random pw' } })

    component.find('form').simulate('submit')

    expect(authActions.LOGIN_INIT).toBeCalledWith({
      password: 'random pw',
      username: 'test@email.com'
    })
  })

  it('displays an error if we submit wrong credentials', () => {
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(() => ({ status: 401 }))
    const { component } = mountWithProvider(<Login />)({})
    expect(component.find('p.error-message').length).toBe(1)
  })
})
