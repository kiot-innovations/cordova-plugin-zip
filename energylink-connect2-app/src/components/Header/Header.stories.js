import React from 'react'
import { storiesOf } from '@storybook/react'

import Header from '.'

const text = '555 Home Street, San Jose, California'

storiesOf('Header', module)
  .add('Simple', () => <Header />)
  .add('With Text', () => <Header text={text} />)
