import React from 'react'
import VersionInformation from './index'
import * as i18n from 'shared/i18n'
import appVersion from '../../macros/appVersion.macro'

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

  const version = appVersion()

  test('renders correctly', () => {
    const { component } = mountWithProvider(
      <VersionInformation appVersion={version} />
    )({})

    expect(component.find('.release-notes').exists()).toBe(true)
    expect(component).toMatchSnapshot()
  })
})
