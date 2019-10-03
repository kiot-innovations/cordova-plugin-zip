import React from 'react'
import { shallow } from 'enzyme'
import PageDots from '.'

describe('PageDots component', () => {
  it('renders without crashing', () => {
    const component = shallow(<PageDots />)
    expect(component).toMatchSnapshot()
  })

  it('renders arbitrary number of dots', () => {
    const component = shallow(<PageDots totalDots="10" />)
    expect(component).toMatchSnapshot()
  })

  it('renders the selected dot provided', () => {
    const component = shallow(<PageDots selectedDot="3" />)
    expect(component).toMatchSnapshot()
  })
})
