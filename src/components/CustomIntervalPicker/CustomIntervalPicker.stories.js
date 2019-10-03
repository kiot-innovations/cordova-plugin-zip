import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import CustomIntervalPicker from './index'

storiesOf('CustomIntervalPicker', module).add('Completed', () => (
  <div className="mt-10 mb-10 mr-10 ml-10 is-centered is-flex file full-min-height">
    <CustomIntervalPicker onChange={action('changed')} />
  </div>
))
