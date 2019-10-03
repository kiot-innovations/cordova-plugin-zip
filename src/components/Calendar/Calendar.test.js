import React from 'react'
import { shallow } from 'enzyme'

import Calendar from '.'

describe('Calendar Component', () => {
  it('renders without crashing', () => {
    const component = shallow(<Calendar />)
    expect(component).toMatchSnapshot()
  })
})
