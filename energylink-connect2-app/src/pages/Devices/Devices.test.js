import React from 'react'
import * as ReactDOM from 'react-dom'
import * as i18n from 'shared/i18n'
import Devices from '.'

let component
const state = {
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      }
    ]
  },
  devices: {
    candidates: [
      { SERIAL: 'E00110223232323', STATEDESCR: 'OK' },
      { SERIAL: 'E00110223232324', STATEDESCR: 'OK' }
    ],
    claimingDevices: false,
    claimError: null,
    claimProgress: 0,
    error: null,
    progress: 10,
    discoverComplete: false
  }
}

describe('Devices page', () => {
  beforeEach(() => {
    jest.spyOn(i18n, 'useI18n').mockImplementation(() => key => key)
    jest
      .spyOn(ReactDOM, 'createPortal')
      .mockImplementation(() => jest.fn((element, node) => element))
    component = mountWithProvider(<Devices />)(state)
  })

  test('Renders correctly', () => {
    expect(component).toMatchSnapshot()
  })
})
