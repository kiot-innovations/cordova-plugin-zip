import React from 'react'
import { shallow } from 'enzyme'
import ModalLayout from '.'

describe('ModalLayout component', () => {
  const mockHistory = {
    location: { state: {} },
    push: jest.fn(),
    goBack: jest.fn()
  }

  it('renders without crashing', () => {
    const component = shallow(<ModalLayout />)
    expect(component).toMatchSnapshot()
  })

  it('fires history.goBack when pressing the back arrow', () => {
    const component = shallow(<ModalLayout history={mockHistory} />)

    component.find('.close-button').simulate('click')

    expect(mockHistory.goBack).toBeCalled()
  })

  it('fires history.goBack when pressing the back arrow', () => {
    const component = shallow(
      <ModalLayout history={mockHistory} hasBackButton={true} />
    )

    component.find('.close-button').simulate('click')

    expect(mockHistory.push).toBeCalledWith({ pathname: '/', state: {} })
  })

  it('fires a custom function if provided when pressing the back arrow', () => {
    const customFn = jest.fn()
    const component = shallow(
      <ModalLayout history={mockHistory} onClose={customFn} />
    )

    component.find('.close-button').simulate('click')

    expect(customFn).toBeCalled()
  })
})
