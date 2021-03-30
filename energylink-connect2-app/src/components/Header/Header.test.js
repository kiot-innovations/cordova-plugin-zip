import React from 'react'
import { createMemoryHistory } from 'history'
import * as i18n from 'shared/i18n'
import { Header } from '.'

describe('Header Component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders correctly', () => {
    const { component } = mountWithProvider(<Header />)({
      firmwareUpdate: { upgrading: null, status: null, percent: null }
    })
    expect(component).toMatchSnapshot()
  })

  test('Renders text instead of logo', () => {
    const history = createMemoryHistory({
      initialEntries: [{ pathname: '/show-address', key: 'testKey' }]
    })
    const { component } = mountWithProvider(<Header />)(
      {
        firmwareUpdate: { upgrading: null, status: null, percent: null },
        site: {
          site: {
            address1: 'ADDRESS',
            latitude: 20.6881818,
            longitude: -103.4218501
          }
        }
      },
      history
    )
    expect(component.find('span.text').text()).toBe('ADDRESS')
    expect(component).toMatchSnapshot()
  })
})
