import React from 'react'
import ModelEdit from '.'
import * as i18n from 'shared/i18n'
import * as ReactDOM from 'react-dom'

describe('MI Model Editing page', () => {
  beforeEach(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element
    })
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

  const mockedStore = {
    systemConfiguration: {
      submit: {
        commissioned: false,
        submitting: true,
        error: false
      }
    },
    rma: {
      rmaMode: 'EDIT_DEVICES'
    },
    inventory: {
      bom: [
        { item: 'AC_MODULES', value: '0' },
        { item: 'DC_MODULES', value: '0' },
        { item: 'STRING_INVERTERS', value: '0' },
        { item: 'EXTERNAL_METERS', value: '0' },
        { item: 'ESS', value: '0' }
      ]
    },
    pvs: {
      settingMetadata: false,
      setMetadataStatus: null
    },
    devices: {
      candidates: [
        {
          ISDETAIL: true,
          SERIAL: 'E00121938109605',
          TYPE: 'SOLARBRIDGE',
          STATE: 'working',
          STATEDESCR: 'Has Not Reported',
          MODEL: 'AC_Module_Type_E',
          DESCR: 'Inverter E00121938109605',
          DEVICE_TYPE: 'Inverter',
          SWVER: '4.14.5',
          PORT: '',
          MOD_SN: '',
          NMPLT_SKU: '',
          origin: 'data_logger',
          OPERATION: 'noop',
          CURTIME: '2020,04,20,22,17,23'
        }
      ],
      found: [
        {
          ISDETAIL: true,
          SERIAL: 'E00121938109605',
          TYPE: 'SOLARBRIDGE',
          STATE: 'working',
          STATEDESCR: 'Has Not Reported',
          MODEL: 'AC_Module_Type_E',
          DESCR: 'Inverter E00121938109605',
          DEVICE_TYPE: 'Inverter',
          SWVER: '4.14.5',
          PORT: '',
          MOD_SN: '',
          NMPLT_SKU: '',
          origin: 'data_logger',
          OPERATION: 'noop',
          CURTIME: '2020,04,20,22,17,23'
        }
      ],
      miModels: { E: ['SPR1234', 'SPR5678'] },
      fetchingDevices: false
    }
  }

  test('renders correctly', () => {
    const component = mountWithProvider(<ModelEdit />)(mockedStore)
    expect(component).toMatchSnapshot()
  })
})
