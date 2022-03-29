import React from 'react'

import PCS from '.'

import * as i18n from 'shared/i18n'

describe('PCS / PCS page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Page renders correctly', () => {
    const { component } = mountWithProvider(<PCS />)({
      pcs: {
        busBarRating: { label: '50A', value: 50 },
        breakerRating: { label: '50A', value: 50 },
        hubPlusBreakerRating: { label: '50A', value: 50 },
        enablePCS: true
      }
    })
    expect(component).toMatchSnapshot()
  })
})
