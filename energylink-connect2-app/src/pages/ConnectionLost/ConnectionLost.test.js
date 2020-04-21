import React from 'react'
import PvsConnectionSuccessful from '.'
import * as i18n from 'shared/i18n'

describe('ConnectionLost component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<PvsConnectionSuccessful />)({
      pvs: {
        serialNumber: 'ZT123123123009'
      }
    })
    expect(component).toMatchSnapshot()
  })
})
