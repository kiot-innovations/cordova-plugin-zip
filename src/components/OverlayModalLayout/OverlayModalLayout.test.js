import React from 'react'
import { shallow } from 'enzyme'
import OverlayModalLayout from '.'
import * as reactRedux from 'react-redux'

describe('OverlayModalLayout component', () => {
  it('renders without crashing', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => false)
    const component = shallow(<OverlayModalLayout />)
    expect(component).toMatchSnapshot()
  })
})
