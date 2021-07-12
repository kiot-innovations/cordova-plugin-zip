import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Collapsible from '.'

const title = '555 Home Street, San Jose, California'

const actions = (
  <div className="actions">
    <span className="sp-stop is-size-4 pr-20" onClick={action('stop')} />
    <span className="sp-download is-size-4" onClick={action('download')} />
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
