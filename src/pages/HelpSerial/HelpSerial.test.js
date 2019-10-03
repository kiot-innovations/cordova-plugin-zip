import React from 'react'
import { shallow } from 'enzyme'
import HelpSerial from '.'

describe('HelpSerial page', () => {
  it('renders without crashing', () => {
    const component = shallow(<HelpSerial />)
    expect(component).toMatchSnapshot()
  })
})
