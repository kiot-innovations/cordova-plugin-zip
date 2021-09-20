import React from 'react'
import * as reactRedux from 'react-redux'

import StringInverters from '.'

import * as i18n from 'shared/i18n'

const mockHistory = jest.fn()
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistory
  })
}))

describe('The StringInverters main page', function() {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  const store = {
    pvs: {
      settingMetadata: {},
      setMetadataStatus: ''
    },
    devices: {
      found: [
        {
          SERIAL: 'ConsumptionMeter001ca',
          DEVICE_TYPE: 'Inverter',
          type: 'Inverter',
          SUBTYPE: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A390-BLK',
          COUNT: 1
        },
        {
          SERIAL: 'ConsumptionMeter002ca',
          DEVICE_TYPE: 'Inverter',
          type: 'Inverter',
          SUBTYPE: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A400-BLK',
          COUNT: 1
        },
        {
          SERIAL: 'ConsumptionMeter001ca',
          DEVICE_TYPE: 'Power Meter',
          type: 'Power Meter',
          SUBTYPE: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A390-BLK',
          COUNT: 1
        }
      ],
      progress: {
        progress: [
          {
            TYPE: 'MicroInverters',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SPRf',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SunSpecDevices',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'Meters',
            PROGR: '20',
            NFOUND: '0'
          },
          {
            TYPE: 'HubPlus',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'OtherInverters',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'MetStations',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'MIO',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'PV Disconnect',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SPRm',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SPRk',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'SPRp',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'GroundCurMon',
            PROGR: '100',
            NFOUND: '0'
          },
          {
            TYPE: 'PVS5Meter',
            PROGR: '100',
            NFOUND: '2'
          }
        ],
        complete: false
      }
    },
    stringInverters: {
      models: ['SPR-A390-BLK', 'SPR-A400-BLK']
    }
  }

  it('should render correctly', function() {
    const { component } = mountWithProvider(<StringInverters />)(store)
    expect(component).toMatchSnapshot()
  })
})
