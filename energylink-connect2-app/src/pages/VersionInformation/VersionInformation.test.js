import React from 'react'
import VersionInformation from './index'
import * as i18n from 'shared/i18n'

describe('VersionInformation component', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          goBack: jest.fn()
        }
      })
    }))
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<VersionInformation />)({})
    expect(component.find('.release-notes').exists()).toBe(true)
    expect(component).toMatchSnapshot()
  })
})
