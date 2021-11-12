import React from 'react'
import * as reactRedux from 'react-redux'

import DiscoveryError from './DiscoveryError'

import SwipeableSheet from 'hocs/SwipeableSheet'
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
          subtype: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A390-BLK',
          COUNT: 1
        },
        {
          SERIAL: 'ConsumptionMeter002ca',
          DEVICE_TYPE: 'Inverter',
          type: 'Inverter',
          subtype: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A400-BLK',
          COUNT: 1
        },
        {
          SERIAL: 'ConsumptionMeter001ca',
          DEVICE_TYPE: 'Power Meter',
          type: 'Power Meter',
          subtype: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A390-BLK',
          COUNT: 1
        }
      ],
      error: false
    },
    stringInverters: {
      models: ['SPR-A390-BLK', 'SPR-A400-BLK']
    }
  }

  it('should render correctly', function() {
    const { component } = mountWithProvider(<DiscoveryError />)(store)
    expect(component).toMatchSnapshot()
  })

  it('should run retryDiscovery function', function() {
    const { component } = mountWithProvider(<DiscoveryError />)(store)
    const sheet = component.find(SwipeableSheet)
    sheet.prop('onChange')()
    const button = component.find(
      '.is-uppercase.is-uppercase.is-primary.button.mt-20'
    )
    button.simulate('click')

    expect(sheet.prop('open')).toBe(false)
  })
})
