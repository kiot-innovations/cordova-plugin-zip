import React from 'react'

import { storiesOf } from '@storybook/react'

import MainNavbar from './index'

storiesOf('MainNavbar', module).add('Simple', () => (
  <MainNavbar location={{ pathname: '/' }} />
))
