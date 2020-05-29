import React from 'react'

import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

const Welcome = () => (
  <div className="card has-background-white has-text-black">
    <p className>Here you can find stories regarding CM2 Components.</p>

    <button className="button is-info is-uppercase " onClick={linkTo('Header')}>
      Click here to see a Header
    </button>
  </div>
)

storiesOf('1/Welcome', module).add('to CM2 Playground', () => <Welcome />)
