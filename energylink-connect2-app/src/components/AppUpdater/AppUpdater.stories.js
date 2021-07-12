import { action } from '@storybook/addon-actions/dist'
import { storiesOf } from '@storybook/react'
import React from 'react'

import AppUpdater from '.'

storiesOf('AppUpdater', module).add('Simple', () => (
  <div className="full-min-height pl-20 pr-20">
    <AppUpdater onUpdate={action('Update btn pressed')} />
  </div>
))
