import React from 'react'
import { shallow } from 'enzyme'
import BackButton from '.'

describe('BackButton component', () => {
  const mockHistory = {
    goBack: jest.fn()
  }

  it('renders without crashing', () => {
    const component = shallow(<BackButton />)
    expect(component).toMatchSnapshot()
  })

  it('fires history.goBack when pressing the back arrow', () => {
    const component = shallow(<BackButton history={mockHistory} />)

    component.find('.back-button').simulate('click')

    expect(mockHistory.goBack).toBeCalled()
  })
})
