import { storiesOf } from '@storybook/react'
import React from 'react'

import { ButtonLink } from '.'

const title = 'Quick Start Guides'

storiesOf('ButtonLink', module).add('Simple', () => (
  <div className="full-min-height">
    <ButtonLink title={title} />
  </div>
))
