import React from 'react'
import FirmwareReleaseNotes from './index'
import * as i18n from 'shared/i18n'

describe('VersionInformation component', () => {
  let initialState = {
    firmwareUpdate: {
      releaseNotes: {
        meta: {
          version: '1.0.0',
          description: 'This file contains the release notes for PVS firmware',
        },
        versions: [
          {
            versionNumber: 'Release 8616',
            releaseDate: '2020-11-05',
            bodyMarkdown:
              '# Features\n- SunVault ready\n- Full support for Pro Connect app',
          },
          {
            versionNumber: 'Release 6415',
            releaseDate: '2020-10-01',
            bodyMarkdown:
              '# Improvements\n- Bulletproof protection against interference from nearby Envoys\nRobust microinverter firmware upgrade',
          },
        ],
      },
    },
  }

  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          goBack: jest.fn(),
        },
      }),
    }))
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation((path) => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<FirmwareReleaseNotes />)(
      initialState
    )
    expect(component.find('.release-notes').exists()).toBe(true)
    expect(component).toMatchSnapshot()
  })
})
