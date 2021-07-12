import { storiesOf } from '@storybook/react'
import React from 'react'

import ProgressiveImage from './'

const src =
  'https://maps.googleapis.com/maps/api/staticmap?center=26.019552,-80.248990&zoom=21&size=800x800&key=AIzaSyDQw3_CY42OoC70LXehwBFUk-xb25DfCns&maptype=hybrid&markers=scale:4|blue|26.019552,-80.248990&scale=4'

storiesOf('ProgressiveImage', module)
  .add('Loading', () => <ProgressiveImage />)
  .add('With Image', () => <ProgressiveImage src={src} />)
