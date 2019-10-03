import React from 'react'
import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'
import * as reactRedux from 'react-redux'
import * as i18n from '../../shared/i18n'
import * as userActions from '../../state/actions/user'
import UpdatePassword from '.'

describe('UpdatePassword page', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(userActions, 'updateUser').mockImplementation(jest.fn)
  })

  it('renders without crashing', () => {
    const component = shallow(<UpdatePassword />)
    expect(component).toMatchSnapshot()
  })

  it('triggers update user action when all values are correct', async () => {
    const { component } = mountWithProvider(<UpdatePassword />)({})
    const currentPass = 'Another2000'
    const newPass = 'Another2001'

    await act(async () => {
      component
        .find('input[placeholder="PASSWORD_CURRENT"]')
        .simulate('change', { target: { value: currentPass } })
      component
        .find('input[placeholder="PASSWORD_NEW"]')
        .simulate('change', { target: { value: newPass } })
      component
        .find('input[placeholder="PASSWORD_NEW_1"]')
        .simulate('change', { target: { value: newPass } })

      component.find('form').simulate('submit')
    })
    expect(userActions.updateUser).toBeCalledWith(
      {
        currentpassword: currentPass,
        password: newPass
      },
      null,
      true
    )
  })
})
