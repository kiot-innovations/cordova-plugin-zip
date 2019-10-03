import React from 'react'

import { storiesOf } from '@storybook/react'

import BlockGrid from './index'

storiesOf('BlockGrid', module).add('Simple', () => (
  <BlockGrid> This is a block grid </BlockGrid>
))
