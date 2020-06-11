import React from 'react'
import { storiesOf } from '@storybook/react'
import ESSHealthCheck from '.'

const errors = [{ code: '234' }]

storiesOf('ESSHealthCheck Page', module)
  .add('Generating report', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck errors={[]} />
    </div>
  ))
  .add('When error', () => (
    <div className="full-min-height pl-10 pr-10">
      <ESSHealthCheck errors={errors} />
    </div>
  ))
