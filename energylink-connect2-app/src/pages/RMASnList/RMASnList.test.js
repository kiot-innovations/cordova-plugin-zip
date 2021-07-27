import React from 'react'
import * as ReactDOM from 'react-dom'

import RMASnList from '.'

import * as i18n from 'shared/i18n'

describe('RMASnList page', () => {
  const provider = {
    global: {
      canAccessScandit: true
    },
    pvs: {
      serialNumbers: [],
      fetchingSN: false,
      serialNumbersError: [
        { SERIAL: 'E00110223232323', STATEDESCR: 'NEW' },
        { SERIAL: 'E00110223232324', STATEDESCR: 'OK' }
      ]
    },
    inventory: {
      bom: [
        { item: 'AC_MODULES', value: '0' },
        { item: 'DC_MODULES', value: '0' },
        { item: 'STRING_INVERTERS', value: '0' },
        { item: 'EXTERNAL_METERS', value: '0' },
        { item: 'ESS', value: '0' }
      ]
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
    jest
      .spyOn(ReactDOM, 'createPortal')
      .mockImplementation(() => jest.fn((element, node) => element))
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<RMASnList />)(provider)
    expect(component).toMatchSnapshot()
  })
})
