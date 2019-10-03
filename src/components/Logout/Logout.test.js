import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import * as authActions from '../../state/actions/auth'
import Logout from '.'
import * as i18n from '../../shared/i18n'

describe('Logout', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()

    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
    jest.spyOn(authActions, 'logout').mockImplementation(jest.fn)
    jest.spyOn(i18n, 'useI18n').mockImplementation(path => key => key)
  })

  it('renders without crashing', () => {
    const component = shallow(<Logout />)
    expect(component).toMatchSnapshot()
  })

  it('dispatches logout action when clicked', () => {
    const { component } = mountWithProvider(<Logout />)({})
    component.find('button').simulate('click')
    expect(authActions.logout).toBeCalled()
  })
})
