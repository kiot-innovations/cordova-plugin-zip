import React from 'react'

import ConfigureStringInverters from '.'

import * as i18n from 'shared/i18n'

describe('ConfigureStringInverters component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<ConfigureStringInverters />)({
      pvs: {
        settingMetadata: {},
        setMetadataStatus: ''
      },
      devices: {
        found: []
      }
    })
    expect(component).toMatchSnapshot()
  })
})
