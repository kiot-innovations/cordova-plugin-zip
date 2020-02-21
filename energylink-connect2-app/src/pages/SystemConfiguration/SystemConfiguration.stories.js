import React from 'react'
import { storiesOf } from '@storybook/react'

import SC from './InterfacesWidget'

storiesOf('System Configuration Page', module).add('InterfacesWidget', () => (
  <div className="full-min-height ml-10 mr-10 mt-20">
    <SC />
  </div>
))
