import React from 'react'
import * as reactRedux from 'react-redux'
import * as authActions from '../../state/actions/auth'
import * as mobileActions from '../../state/actions/mobile'
import * as i18n from '../../shared/i18n'
import PrivateRoute from '.'

describe('Private Route', () => {
  const myComponent = () => <div>Example component</div>
  let dispatchMock
  const previousLocation = {
    pathname: '/'
  }

  beforeEach(() => {
    dispatchMock = jest.fn()
    window.scrollTo = jest.fn()

    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => key => key.toUpperCase())
    jest
      .spyOn(mobileActions, 'deviceResumeListener')
      .mockImplementation(() => 'device ready listener fired')
    jest
      .spyOn(authActions, 'validateSession')
      .mockImplementation(() => 'validate session fired')
  })

  it('redirects if not logged in', () => {
    const component = mountWithProvider(
      <PrivateRoute location={previousLocation} />
    )({})
    expect(component).toMatchSnapshot()
    expect(window.scrollTo).toBeCalled()
  })

  it('renders the provided component in a route if we are logged in', () => {
    const component = mountWithProvider(
      <PrivateRoute
        location={previousLocation}
        isLoggedIn={true}
        component={myComponent}
      />
    )({})
    expect(component).toMatchSnapshot()
    expect(window.scrollTo).toBeCalled()
  })

  it('does not actions if we are not logged in', () => {
    mountWithProvider(<PrivateRoute location={previousLocation} />)({})
    expect(dispatchMock).not.toBeCalled()
    expect(window.scrollTo).toBeCalled()
  })
})
