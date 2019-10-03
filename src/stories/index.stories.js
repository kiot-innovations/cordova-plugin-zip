import React from 'react'

import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

const Welcome = () => (
  <div className="card has-background-white has-text-black">
    <p className>Here you can find stories regarding ELH Components.</p>

    <button className="button is-info " onClick={linkTo('Reports')}>
      clic here to see a Report
    </button>
  </div>
)

storiesOf('1/Welcome', module).add('to ELH Playground', () => (
  <Welcome showApp={linkTo('Button')} />
))
