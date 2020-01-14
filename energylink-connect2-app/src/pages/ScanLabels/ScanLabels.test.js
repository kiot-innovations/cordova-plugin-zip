import React from 'react'
import ScanLabels from '.'
import * as i18n from 'shared/i18n'

describe('Bulk Scan screen', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<ScanLabels />)({
      pvs: {
        serialNumbers: [],
        fetchingSN: false
      }
    })
    expect(component).toMatchSnapshot()
  })
})
