import React from 'react'
import { shallow } from 'enzyme'
import ProgressBar, { SIZES } from '.'

describe('ProgressBar component', () => {
  it('renders without crashing', () => {
    const component = shallow(<ProgressBar />)
    expect(component).toMatchSnapshot()
  })

  it('renders indefinite state if we pass value null', () => {
    const component = shallow(<ProgressBar value={null} />)
    expect(component).toMatchSnapshot()
  })

  it('renders different sizes', () => {
    const component = shallow(<ProgressBar size={SIZES.MEDIUM} />)
    expect(component).toMatchSnapshot()
  })
})
