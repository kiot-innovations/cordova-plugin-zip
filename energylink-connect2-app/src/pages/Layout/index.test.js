import React from 'react'
import { shallow } from 'enzyme'
import Layout from '.'

describe('Layout component', () => {
  test('render correctly', () => {
    const component = shallow(<Layout />)
    expect(component).toMatchSnapshot()
  })
})
