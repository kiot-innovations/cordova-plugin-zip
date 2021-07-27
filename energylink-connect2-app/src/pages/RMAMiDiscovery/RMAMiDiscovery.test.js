import React from 'react'
import RMAMiDiscovery from '.'
import * as ReactDOM from 'react-dom'
import * as i18n from 'shared/i18n'

describe('RMAMiDiscovery page', () => {
  const provider = {
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
    const { component } = mountWithProvider(<RMAMiDiscovery />)(provider)
    expect(component).toMatchSnapshot()
  })
})
