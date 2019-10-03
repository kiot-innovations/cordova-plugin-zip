import React from 'react'
import { shallow } from 'enzyme'
import paths from '../Router/paths'
import Signup from '.'
import * as i18n from '../../shared/i18n'
import { act } from 'react-dom/test-utils'
import * as authActions from '../../state/actions/auth'

describe('Signup page', () => {
  let mockHistory
  let mockCheckEmail

  beforeEach(() => {
    mockHistory = {
      push: jest.fn()
    }
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )

    mockCheckEmail = jest.spyOn(authActions, 'checkEmail')
  })

  it('renders without crashing', () => {
    const component = shallow(<Signup />)
    expect(component).toMatchSnapshot()
  })

  it('redirects if we are logged in', () => {
    const component = shallow(<Signup isLoggedIn="true" />)
    expect(component).toMatchSnapshot()
  })

  it('displays an error if we submit without filling', async () => {
    mockCheckEmail.mockImplementation(() => ({ status: 400, data: {} }))
    let component
    await act(async () => {
      component = mountWithProvider(<Signup history={mockHistory} />)({})
        .component
    })

    await act(async () => {
      component.find('form').simulate('submit')
    })

    await await nextTick(() => {
      component.update()
      expect(component.find('span.error').length).toBe(3)
    })
  })

  it('displays an error if we submit without filling the name', async () => {
    mockCheckEmail.mockImplementation(() => ({ status: 200, data: {} }))

    let component
    await act(async () => {
      component = mountWithProvider(<Signup history={mockHistory} />)({})
        .component
    })
    await act(async () => {
      component
        .find('input[placeholder="PLACEHOLDER_EMAIL"]')
        .simulate('change', { target: { value: 'email@email.com' } })
      component
        .find('input[placeholder="PLACEHOLDER_PHONE"]')
        .simulate('change', { target: { value: '555-555-5555' } })
      component.find('form').simulate('submit')
    })
    await nextTick(() => {
      component.update()
      expect(component.find('span.error').length).toBe(1)
      expect(component.find('span.error')).toMatchSnapshot()
    })
  })

  it('displays an error if we enter an invalid name', async () => {
    mockCheckEmail.mockImplementation(() => ({ status: 200, data: {} }))

    let component
    await act(async () => {
      component = mountWithProvider(<Signup history={mockHistory} />)({})
        .component
    })

    await act(async () => {
      component
        .find('input[placeholder="PLACEHOLDER_NAME"]')
        .simulate('change', { target: { value: 'invalid' } })
    })

    await act(async () => {
      component.find('form').simulate('submit')
    })

    await nextTick(() => {
      component.update()
      expect(component.find('span.error').length).toBe(3)
      expect(component.find('span.error')).toMatchSnapshot()
    })
  })

  it('displays an error if we submit without filling the email', async () => {
    let component
    await act(async () => {
      component = mountWithProvider(<Signup history={mockHistory} />)({})
        .component
    })

    await act(async () => {
      component
        .find('input[placeholder="PLACEHOLDER_NAME"]')
        .simulate('change', { target: { value: 'random name' } })
      component
        .find('input[placeholder="PLACEHOLDER_PHONE"]')
        .simulate('change', { target: { value: '5555555555' } })
    })
    await act(async () => {
      component.find('form').simulate('submit')
    })
    await nextTick(() => {
      component.update()
      expect(component.find('span.error').length).toBe(1)
      expect(component.find('span.error')).toMatchSnapshot()
    })
  })

  it('displays an error if we submit without filling the phone number', async () => {
    mockCheckEmail.mockImplementation(() => ({ status: 200, data: {} }))

    let component
    await act(async () => {
      component = mountWithProvider(<Signup history={mockHistory} />)({})
        .component
    })

    await act(async () => {
      component
        .find('input[placeholder="PLACEHOLDER_NAME"]')
        .simulate('change', { target: { value: 'random name' } })
      component
        .find('input[placeholder="PLACEHOLDER_EMAIL"]')
        .simulate('change', { target: { value: 'email@email.com' } })
    })
    await act(async () => {
      component.find('form').simulate('submit')
    })
    await nextTick(() => {
      component.update()
      expect(component.find('span.error').length).toBe(1)
      expect(component.find('span.error')).toMatchSnapshot()
    })
  })

  it('displays an error if we enter an invalid phone number', async () => {
    mockCheckEmail.mockImplementation(() => ({ status: 200, data: {} }))

    let component
    await act(async () => {
      component = mountWithProvider(<Signup history={mockHistory} />)({})
        .component
    })

    await act(async () => {
      component
        .find('input[placeholder="PLACEHOLDER_PHONE"]')
        .simulate('change', { target: { value: 'invalid' } })
    })
    await act(async () => {
      component.find('form').simulate('submit')
    })

    await nextTick(() => {
      component.update()
      expect(component.find('span.error').length).toBe(3)
      expect(component.find('span.error')).toMatchSnapshot()
    })
  })

  it('redirects properly when submitting', async () => {
    mockCheckEmail.mockImplementation(() => ({ status: 200, data: {} }))

    let component
    await act(async () => {
      component = mountWithProvider(<Signup history={mockHistory} />)({})
        .component
    })
    await act(async () => {
      component
        .find('input[placeholder="PLACEHOLDER_NAME"]')
        .simulate('change', { target: { value: 'random name' } })
      component
        .find('input[placeholder="PLACEHOLDER_EMAIL"]')
        .simulate('change', { target: { value: 'email@email.com' } })
      component
        .find('input[placeholder="PLACEHOLDER_PHONE"]')
        .simulate('change', { target: { value: '1 5555555555' } })
      component.find('form').simulate('submit')
    })

    expect(mockHistory.push).toBeCalledWith({
      pathname: paths.SIGNUP_SERIAL,
      state: {
        signUpState: {
          name: 'random name',
          phoneNumber: '1 5555555555',
          email: 'email@email.com'
        }
      }
    })
  })
})
