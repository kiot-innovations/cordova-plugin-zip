import React from 'react'
import { shallow } from 'enzyme'
import Header from '.'

describe('Header Component', () => {
  test('Renders correctly', () => {
    const component = shallow(<Header />)
    expect(component).toMatchSnapshot()
  })
})
