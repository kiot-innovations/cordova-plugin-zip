import { storiesOf } from '@storybook/react'
import React from 'react'

import ListRow from '.'

const title = 'Equinox AC Modules'

storiesOf('ListRow', module).add('Simple', () => (
  <div className="full-min-height">
    <ListRow title={title} />
  </div>
))
