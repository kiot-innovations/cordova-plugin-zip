import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import ButtonSelect from './index'

storiesOf('ButtonSelect', module)
  .add('Simple', () => (
    <div className="is-flex level mt-20 mb-20 mr-20 ml-20">
      <ButtonSelect
        onAction={action('show something please')}
        label="Start Date"
      />
      <ButtonSelect
        onAction={action('show something please')}
        label="End Date"
      />
    </div>
  ))
  .add('With a value', () => (
    <div className="is-flex level mt-20 mb-20 mr-20 ml-20">
      <ButtonSelect
        onAction={action('did you just clicked?')}
        onClear={action("Let's clear the value later")}
        value="08/22/1990"
      />
    </div>
  ))
