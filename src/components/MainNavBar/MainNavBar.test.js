import React from 'react'
import * as reactRedux from 'react-redux'
import { shallow } from 'enzyme'
import MainNavBar from '.'

describe('MainNavBar component', () => {
  const previousLocation = {
    pathname: '/'
  }

  it('renders without crashing', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => true)
    const component = shallow(<MainNavBar location={previousLocation} />)
    expect(component).toMatchSnapshot()
  })

  it('hides bell notification if there are no alerts', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => false)
    const component = shallow(<MainNavBar location={previousLocation} />)
    expect(component).toMatchSnapshot()
  })
})
