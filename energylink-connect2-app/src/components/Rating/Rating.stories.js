import React from 'react'

import { storiesOf } from '@storybook/react'

import Rating from './'

storiesOf('Rating', module).add('Default (one star)', () => <Rating />)
storiesOf('Rating', module).add('Two stars', () => <Rating rating={2} />)
storiesOf('Rating', module).add('Three stars', () => <Rating rating={3} />)
storiesOf('Rating', module).add('Four stars', () => <Rating rating={4} />)
storiesOf('Rating', module).add('Five stars', () => <Rating rating={5} />)
