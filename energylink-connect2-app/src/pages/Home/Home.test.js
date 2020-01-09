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

  test('render correctly', () => {
    const component = mountWithProvider(<Home />)({
      site: {}
    })
    expect(component).toMatchSnapshot()
  })
})
