import React from 'react'

import Home from '.'

import * as i18n from 'shared/i18n'

describe('Home component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const component = mountWithProvider(<Home />)({
      site: {
        sites: [],
        isFetching: false
      },
      user: { auth: { access_token: '123' } },
      global: {
        statusMessages: []
      },
      firmwareUpdate: {},
      network: {}
    })
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when there are sites available', () => {
    const component = mountWithProvider(<Home />)({
      user: { auth: { access_token: '123' } },
      site: {
        sites: [{}, {}, {}],
        site: {
          latitude: 20.6881818,
          longitude: -103.4218501
        },
        isFetching: false
      },
      global: {
        statusMessages: []
      },
      firmwareUpdate: {},
      network: {}
    })
    expect(component).toMatchSnapshot()
  })

  test('renders messages', () => {
    const component = mountWithProvider(<Home />)({
      user: { auth: { access_token: '123' } },
      site: {
        sites: [{}, {}, {}],
        site: {
          latitude: 20.6881818,
          longitude: -103.4218501
        },
        isFetching: false
      },
      global: {
        statusMessages: [
          {
            meta: {
              notes: 'This message always shows'
            },
            content:
              "<div style='color:blue;'><h1>Some Title Content</h1><p>Some explanation for something we need to tell the installer goes here.</p></div>"
          }
        ]
      },
      firmwareUpdate: {},
      network: {}
    })
    expect(component).toMatchSnapshot()
  })
})
