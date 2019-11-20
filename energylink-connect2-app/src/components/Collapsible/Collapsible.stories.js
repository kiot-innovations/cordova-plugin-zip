import React from 'react'
import { storiesOf } from '@storybook/react'

import Collapsible from '.'

const title = '555 Home Street, San Jose, California'

const actions = () => (
  <div className="actions">
    <span className="sp-signal" />
  </div>
)

storiesOf('Collapsible', module)
  .add('Simple', () => (
    <div className="full-min-height">
      <Collapsible title={title}>
        <div className="section">This is the content area</div>
      </Collapsible>
    </div>
  ))
  .add('With Icons', () => (
    <div className="full-min-height">
      <Collapsible title={title} actions={actions}>
        <div className="section">This is the content area</div>
      </Collapsible>
    </div>
  ))
