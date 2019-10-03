import React from 'react'
import { shallow } from 'enzyme'
import ModalItem from '.'

describe('ModalItem component', () => {
  it('renders without crashing', () => {
    const component = shallow(<ModalItem />)
    expect(component).toMatchSnapshot()
  })
})
