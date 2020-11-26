import React from 'react'
import * as Menu from 'components/Menu'
import { Header } from '.'

describe('Header Component', () => {
  beforeEach(() => {
    Menu.default = () => <div />
  })
  test('Renders correctly', () => {
    const { component } = mountWithProvider(<Header />)({
      firmwareUpdate: { upgrading: null, status: null, percent: null }
    })
    expect(component).toMatchSnapshot()
  })

  test('Renders text instead of logo', () => {
    const { component } = mountWithProvider(<Header />)({
      firmwareUpdate: { upgrading: null, status: null, percent: null },
      site: {
        site: {
          address1: 'ADDRESS',
          latitude: 20.6881818,
          longitude: -103.4218501
        }
      }
    })
    expect(component.find('span.text').text()).toBe('ADDRESS')
    expect(component).toMatchSnapshot()
  })
})
