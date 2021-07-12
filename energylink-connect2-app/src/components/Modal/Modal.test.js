import { shallow } from 'enzyme'
import React from 'react'

import Modal from '.'

describe('Modal Component', () => {
  const title = (
    <div>
      <h1>Title</h1>
      <h2>Subtitle</h2>
    </div>
  )

  test('Renders Correctly', () => {
    const component = shallow(
      <Modal title={title} display={true}>
        <h1>Content</h1>
      </Modal>
    )
    expect(component).toMatchSnapshot()
  })
})
