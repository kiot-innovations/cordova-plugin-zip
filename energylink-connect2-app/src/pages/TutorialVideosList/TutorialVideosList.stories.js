import { storiesOf } from '@storybook/react'
import React from 'react'

import TutorialVideosList from '.'

storiesOf('TutorialVideosList Page', module).add('Main', () => {
  return (
    <div className="full-min-height pl-10 pr-10">
      <TutorialVideosList />
    </div>
  )
})
