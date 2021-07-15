import React from 'react'
import { storiesOf } from '@storybook/react'

import KnowledgeBase from '.'

storiesOf('Knowledge Base Page', module).add('Simple', () => {
  return (
    <div className="full-min-height pl-10 pr-10">
      <KnowledgeBase />
    </div>
  )
})
