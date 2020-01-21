import React from 'react'
import { shallow } from 'enzyme'
import Rating from '.'

describe('Rating component', () => {
  it('renders without crashing', () => {
    const component = shallow(<Rating />)
    expect(component).toMatchSnapshot()
  })
  it('renders by default 1 yellow star', () => {
    const component = shallow(<Rating />)
    expect(component.find('.active').length).toBe(1)
  })
  it('renders 2 yellow stars if rating is 2', () => {
    const component = shallow(<Rating rating={2} />)
    expect(component.find('.active').length).toBe(2)
  })
  it('renders 3 yellow stars if rating is 3', () => {
    const component = shallow(<Rating rating={3} />)
    expect(component.find('.active').length).toBe(3)
  })
  it('renders 4 yellow stars if rating is 4', () => {
    const component = shallow(<Rating rating={4} />)
    expect(component.find('.active').length).toBe(4)
  })
  it('renders 5 yellow stars if rating is 5', () => {
    const component = shallow(<Rating rating={5} />)
    expect(component.find('.active').length).toBe(5)
  })
  it('Should send star number on click', () => {
    const mockClick = jest.fn()
    const component = shallow(<Rating rating={5} onClick={mockClick} />)

    component.find('.active').forEach((node, idx) => {
      node.simulate('click')
      expect(mockClick).toBeCalledWith(idx + 1)
    })
  })
})
