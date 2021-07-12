import { storiesOf } from '@storybook/react'
import React from 'react'

import Modal from '.'

const title = (
  <div>
    <h1 style={{ color: '#ffffff', fontWeight: 'bold' }}>Title</h1>
    <h2>Subtitle</h2>
  </div>
)

storiesOf('Modal', module).add('Simple', () => (
  <Modal display={true} title={title}>
    <h1>Content</h1>
  </Modal>
))
