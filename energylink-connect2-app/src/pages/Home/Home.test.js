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
      }
    })
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when there are sites available', () => {
    const component = mountWithProvider(<Home />)({
      site: {
        sites: [{}, {}, {}],
        site: {
          latitude: 20.6881818,
          longitude: -103.4218501
        },
        isFetching: false
      }
    })
    expect(component).toMatchSnapshot()
  })
})
