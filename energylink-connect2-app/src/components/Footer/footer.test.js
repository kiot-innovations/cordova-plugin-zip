import React from 'react'
import Footer from '.'

describe('Footer Component', () => {
  test('Renders correctly', () => {
    const { component } = mountWithProvider(<Footer />)({
      ui: { footer: true },
      network: { connected: false }
    })
    component.update()
    expect(component.html()).toMatchSnapshot()
  })

  test('Renders nothing if Footer is false', () => {
    const { component } = mountWithProvider(<Footer />)({
      ui: { footer: false },
      network: { connected: false }
    })
    component.update()
    expect(component).toMatchSnapshot()
  })
})
