import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import BatteryStats from '.'

describe('BatteryStats Component', () => {
  it('renders without crashing', () => {
    const date = moment(1568994885222)
    const only = date.format('MMM, MM/DD/YY,')
    const hour = date.format('hh:mm') + ' hrs'

    const data = [
      {
        title: only,
        text: hour,
        when: '3h 21m',
        value: '5.7',
        unit: 'kWh',
        color: 'primary',
        high: true
      },
      {
        title: date.add(1, 'days').format('MMM, MM/DD/YY,'),
        text: hour,
        when: '16h 3m',
        value: '43.2',
        unit: 'kWh',
        color: 'primary',
        high: true
      },
      {
        title: date.add(2, 'days').format('MMM, MM/DD/YY,'),
        text: hour,
        when: '16h 3m',
        value: '3.0',
        unit: 'kWh',
        color: 'primary',
        high: true
      },
      {
        title: date.add(3, 'days').format('MMM, MM/DD/YY,'),
        text: hour,
        when: '3h 2m',
        value: '23.2',
        unit: 'kWh',
        color: 'primary',
        high: true
      }
    ]

    const title = 'Historical list of'
    const text = 'Power outages & energy used to power home'

    const component = shallow(
      <BatteryStats data={data} title={title} text={text} />
    )
    expect(component).toMatchSnapshot()
  })
})
