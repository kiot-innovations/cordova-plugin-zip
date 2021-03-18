import React from 'react'
import * as i18n from 'shared/i18n'
import LegacyDiscoverySelector from '.'

describe('Legacy Discovery Settings', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          push: jest.fn()
        }
      })
    }))

    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<LegacyDiscoverySelector />)()
    expect(component).toMatchSnapshot()
  })
})