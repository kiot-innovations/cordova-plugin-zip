import React from 'react'

import Data from '.'

import * as i18n from 'shared/i18n'

describe('Data page', () => {
  const provider = {
    superuser: {
      essUpdateList: [],
      pvsUpdateList: []
    },
    fileDownloader: {
      settings: {
        essUpdateOverride: {
          url: '',
          displayName: ''
        },
        pvsUpdateOverride: {
          url: '',
          displayName: ''
        }
      }
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<Data />)(provider)
    expect(component).toMatchSnapshot()
  })
})
