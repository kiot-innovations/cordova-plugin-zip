import React from 'react'
import { shallow } from 'enzyme'
import BackButtonBar from '.'

describe('BackButtonBar component', () => {
  it('renders without crashing', () => {
    const component = shallow(<BackButtonBar />)
    expect(component).toMatchSnapshot()
  })
})
