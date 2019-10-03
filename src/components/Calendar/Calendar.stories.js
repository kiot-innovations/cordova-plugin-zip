import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Calendar from './index'

const opsMin = {
  minDate: new Date()
}

const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)

const opsMax = {
  maxDate: tomorrow
}

storiesOf('Calendar', module)
  .add('Simple', () => (
    <div className="mt-10 mb-10 mr-10 is-flex file is-centered">
      <Calendar onChange={action('changed')} />
    </div>
  ))
  .add('With Pre-defined Date', () => (
    <div className="mt-10 mb-10 mr-10 is-flex file is-centered">
      <Calendar onChange={action('changed')} value={new Date('08/22/2019')} />
    </div>
  ))
  .add('With Min Date Set', () => (
    <div className="mt-10 mb-10 mr-10 is-flex file is-centered">
      <Calendar onChange={action('changed')} options={opsMin} />
    </div>
  ))
  .add('With Max Date Set', () => (
    <div className="mt-10 mb-10 mr-10 is-flex file is-centered">
      <Calendar onChange={action('changed')} options={opsMax} />
    </div>
  ))
