import React from 'react'
import { shallow } from 'enzyme'
import { Loader } from '.'

describe('Loader component', () => {
  test('renders correctly', () => {
    const component = shallow(<Loader />)
    expect(component).toMatchSnapshot()
  })
})
