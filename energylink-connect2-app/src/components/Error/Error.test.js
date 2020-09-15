import React from 'react'
import { shallow } from 'enzyme'
import ErrorBoundary from '.'

describe('ErrorBoundary component', () => {
  test('render correctly', () => {
    const component = shallow(<ErrorBoundary />)
    expect(component).toMatchSnapshot()
  })
})
