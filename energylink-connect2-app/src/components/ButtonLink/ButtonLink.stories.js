import { storiesOf } from '@storybook/react'
import React from 'react'

import { ButtonLink } from '.'

storiesOf('ButtonLink', module)
  .add('Simple', () => (
    <div className="full-min-height pb-10 pt-10 pl-10 pr-10">
      <ButtonLink title="Take me somewhere" />
    </div>
  ))
  .add('With subtitle', () => (
    <div className="full-min-height pb-10 pt-10 pl-10 pr-10">
      <ButtonLink title="Take me somewhere" subtitle="Somewhere nice" />
    </div>
  ))
