import React from 'react'
import * as reactRedux from 'react-redux'

import * as i18n from '../../shared/i18n'
import * as authActions from '../../state/actions/auth'

import Login from '.'

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
    const { component } = mountWithProvider(<Login />)({
      user: {
        auth: {}
      }
    })
    expect(component).toMatchSnapshot()
  })
})
