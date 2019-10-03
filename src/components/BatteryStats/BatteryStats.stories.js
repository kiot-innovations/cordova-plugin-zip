import React from 'react'
import { storiesOf } from '@storybook/react'
import moment from 'moment'
import BatteryStats from '.'

const date = moment()
const only = date.format('MMM, MM/DD/YY,')
const hour = date.format('h:mm') + ' hrs'

const data = [
  {
    title: only,
    text: hour,
    when: '3h 21m',
    value: '5.7',
    unit: 'kWh',
    color: 'primary'
  },
  {
    title: date.add(1, 'days').format('MMM, MM/DD/YY,'),
    text: hour,
    when: '16h 3m',
    value: '43.2',
    unit: 'kWh',
    color: 'primary'
  },
  {
    title: date.add(2, 'days').format('MMM, MM/DD/YY,'),
    text: hour,
    when: '16h 3m',
    value: '3.0',
    unit: 'kWh',
    color: 'primary'
  },
  {
    title: date.add(3, 'days').format('MMM, MM/DD/YY,'),
    text: hour,
    when: '3h 2m',
    value: '23.2',
    unit: 'kWh',
    color: 'primary'
  }
]

const title = 'Historical list of'
const text = 'Power outages & energy used to power home'

storiesOf('BatteryStats', module).add('Simple', () => (
  <div className="ml-10 mt-10 mr-10 mb-10">
    <BatteryStats data={data} title={title} text={text} />
  </div>
))
