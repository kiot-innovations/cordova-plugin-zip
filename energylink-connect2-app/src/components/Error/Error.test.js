import { shallow } from 'enzyme'
import React from 'react'

import ErrorBoundary from '.'

describe('ErrorBoundary component', () => {
  test('render correctly', () => {
    const component = shallow(<ErrorBoundary />)
    expect(component).toMatchSnapshot()
  })
})
