import React from 'react'

import PVSSelection from '.'

import * as i18n from 'shared/i18n'
import { BLESTATUS } from 'state/reducers/network'
import { rmaModes } from 'state/reducers/rma'

describe('PVS Selection page', () => {
  let initialState = {
    site: {
      sitePVS: [
        {
          deviceSerialNumber: 'ZT3333333000333',
          assignmentEffectiveTimestamp: 1607973762409
        },
        {
          deviceSerialNumber: 'ZT3333333000331',
          assignmentEffectiveTimestamp: 1607973762401
        }
      ]
    },
    network: {
      bluetoothEnabled: true,
      bluetoothStatus: BLESTATUS.DISCOVERY_SUCCESS,
      err: '',
      nearbyDevices: [{ id: 'AA-FF-ID', name: 'ZT3333333000333' }],
      connected: false,
      bleSearching: false
    },
    rma: {
      rmaMode: rmaModes.NONE,
      cloudDeviceTree: {}
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<PVSSelection />)(initialState)
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when we got an error', () => {
    const state = { ...initialState }
    state.network.err = 'CONNECTION_FAILED'
    const { component } = mountWithProvider(<PVSSelection />)(state)
    expect(component).toMatchSnapshot()
  })

  test('renders correctly when bluetooth is disabled', () => {
    const state = { ...initialState }
    state.network.bluetoothEnabled = false
    const { component } = mountWithProvider(<PVSSelection />)(state)
    expect(component.find('.ble-device')).toHaveLength(3)
    expect(
      component
        .find('.ble-device')
        .last()
        .text()
    ).toEqual('ENABLE_BT_PERMISSIONS')
    expect(component).toMatchSnapshot()
  })
})
