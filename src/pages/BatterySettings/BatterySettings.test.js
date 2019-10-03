import React from 'react'
import BatterySettings from '.'
import * as i18n from '../../shared/i18n'

describe('BatterySettings page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = mountWithProvider(<BatterySettings />)
    expect(component).toMatchSnapshot()
  })
})
