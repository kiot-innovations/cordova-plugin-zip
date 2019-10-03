import React from 'react'
import { act } from 'react-dom/test-utils'
import { shallow } from 'enzyme'
import paths from '../Router/paths'
import * as i18n from '../../shared/i18n'
import SignupSerial from './'
import * as authActions from '../../state/actions/auth'

describe('SignupSerial page', () => {
  const previousLocation = {
    state: {
      signUpState: {
        name: 'random name',
        phoneNumber: '12345123',
        email: 'email@email.com'
      }
    }
  }
  let mockHistory
  let mockValidateSerial

  beforeEach(() => {
    mockHistory = {
      push: jest.fn()
    }
    mockValidateSerial = jest.spyOn(authActions, 'validateSerial')
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(<SignupSerial location={previousLocation} />)
    expect(component).toMatchSnapshot()
  })

  it('redirects if we are logged in', () => {
    const component = shallow(
      <SignupSerial location={previousLocation} isLoggedIn="true" />
    )
    expect(component).toMatchSnapshot()
  })

  it("redirects if we don't have a previous signup state", () => {
    const component = shallow(<SignupSerial location={{ state: {} }} />)
    expect(component).toMatchSnapshot()
  })

  it('displays an error if we submit without filling', async () => {
    let component

    await act(async () => {
      component = mountWithProvider(
        <SignupSerial history={mockHistory} location={previousLocation} />
      )({}).component
    })

    await act(async () => {
      component.find('form').simulate('submit')
    })
    await nextTick(() => {
      component.update()
      expect(component.find('.async-text-field span').length).toBe(1)
    })
  })

  it('displays an error if we submit an invalid serial', async () => {
    mockValidateSerial.mockImplementation(() => ({ status: 500, data: {} }))
    let component

    await act(async () => {
      component = mountWithProvider(
        <SignupSerial history={mockHistory} location={previousLocation} />
      )({}).component
    })

    await act(async () => {
      component.find('form').simulate('submit')
    })

    await nextTick(() => {
      component.update()
      expect(component.find('span.error').length).toBe(1)
    })
  })

  it('redirects properly when submitting', async () => {
    mockValidateSerial.mockImplementation(() => ({ status: 200, data: {} }))
    const mockHistory = {
      push: jest.fn()
    }
    let component

    await act(async () => {
      component = mountWithProvider(
        <SignupSerial history={mockHistory} location={previousLocation} />
      )({}).component
    })

    await act(async () => {
      component
        .find('input[placeholder="PLACEHOLDER_SERIAL"]')
        .simulate('change', { target: { value: 'my serial' } })
    })

    await act(async () => {
      component.find('form').simulate('submit')
    })

    await nextTick(() => {
      expect(mockHistory.push).toBeCalledWith({
        pathname: paths.SIGNUP_PASSWORD,
        state: {
          signUpState: {
            name: 'random name',
            phoneNumber: '12345123',
            email: 'email@email.com',
            serial: 'my serial'
          }
        }
      })
    })
  })
})
