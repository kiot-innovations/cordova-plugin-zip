import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import * as authActions from '../../state/actions/auth'
import * as i18n from '../../shared/i18n'
import SignupLoader from '.'

describe('SignupLoader component', () => {
  const previousLocation = {
    state: {
      signUpState: {
        name: 'random name',
        phoneNumber: '12345123',
        email: 'email@email.com',
        serial: '1234',
        password: 'some password',
        addressId: 1234
      }
    }
  }
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest
      .spyOn(authActions, 'createAccount')
      .mockImplementation(() => 'CREATE_ACCOUNT_CALLED')
    jest
      .spyOn(authActions, 'performLogin')
      .mockImplementation(() => 'PERFORM_LOGIN_CALLED')
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  describe('shallow', () => {
    beforeEach(() => {
      jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => false)
    })

    it('renders without crashing', () => {
      const component = shallow(<SignupLoader location={previousLocation} />)
      expect(component).toMatchSnapshot()
    })

    it('redirects if we are logged in', () => {
      const component = shallow(<SignupLoader isLoggedIn="true" />)
      expect(component).toMatchSnapshot()
    })

    it("redirects if we don't have a previous signup state", () => {
      const component = shallow(<SignupLoader />)
      expect(component).toMatchSnapshot()
    })
  })

  describe('mounted', () => {
    it('dispatches a create account action if data is present', () => {
      mountWithProvider(<SignupLoader location={previousLocation} />)({})
      expect(dispatchMock).toBeCalledWith('CREATE_ACCOUNT_CALLED')
    })

    it('renders differently if account has been created', () => {
      const { component } = mountWithProvider(
        <SignupLoader location={previousLocation} />
      )({
        global: { isAccountCreated: true }
      })

      expect(component).toMatchSnapshot()
    })

    it('dispatches a performLogin action if the account has been created', () => {
      mountWithProvider(<SignupLoader location={previousLocation} />)({
        global: {
          isAccountCreated: true
        }
      })

      expect(dispatchMock).toBeCalledWith('PERFORM_LOGIN_CALLED')
    })
  })
})
