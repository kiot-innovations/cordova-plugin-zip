import React from 'react'
import { shallow } from 'enzyme'
import WifiSignalIcon from '.'

describe('WifiSignalIcon component', () => {
  it('renders without crashing', () => {
    const component = shallow(<WifiSignalIcon />)
    expect(component).toMatchSnapshot()
  })

  it('renders with 0 green bar', () => {
    const component = shallow(<WifiSignalIcon signalQuality={0} />)
    expect(component).toMatchSnapshot()
    expect(component.find('rect.has-signal').length).toBe(0)
    expect(component.find('rect.no-signal').length).toBe(5)
  })

  it('renders with 1 green bar', () => {
    const component = shallow(<WifiSignalIcon signalQuality={1} />)
    expect(component).toMatchSnapshot()
    expect(component.find('rect.has-signal').length).toBe(1)
    expect(component.find('rect.no-signal').length).toBe(4)
  })

  it('renders with 2 green bars', () => {
    const component = shallow(<WifiSignalIcon signalQuality={2} />)
    expect(component).toMatchSnapshot()
    expect(component.find('rect.has-signal').length).toBe(2)
    expect(component.find('rect.no-signal').length).toBe(3)
  })

  it('renders with 3 green bars', () => {
    const component = shallow(<WifiSignalIcon signalQuality={3} />)
    expect(component).toMatchSnapshot()
    expect(component.find('rect.has-signal').length).toBe(3)
    expect(component.find('rect.no-signal').length).toBe(2)
  })

  it('renders with 4 green bars', () => {
    const component = shallow(<WifiSignalIcon signalQuality={4} />)
    expect(component).toMatchSnapshot()
    expect(component.find('rect.has-signal').length).toBe(4)
    expect(component.find('rect.no-signal').length).toBe(1)
  })

  it('renders with 5 green bars', () => {
    const component = shallow(<WifiSignalIcon signalQuality={5} />)
    expect(component).toMatchSnapshot()
    expect(component.find('rect.has-signal').length).toBe(5)
    expect(component.find('rect.no-signal').length).toBe(0)
  })
})
