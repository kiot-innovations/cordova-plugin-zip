import { storiesOf } from '@storybook/react'
import React from 'react'

import EmbedVideo from '.'

storiesOf('Embed Video', module).add('Simple', () => (
  <EmbedVideo title={'Title'} embedId="rghwZ637Rxs" />
))
