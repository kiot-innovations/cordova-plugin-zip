import React from 'react'
import { shallow } from 'enzyme'

import ButtonSelect from '.'

describe('ButtonSelect Component', () => {
  it('renders without crashing', () => {
    const component = shallow(<ButtonSelect />)
    expect(component).toMatchSnapshot()
  })
})
