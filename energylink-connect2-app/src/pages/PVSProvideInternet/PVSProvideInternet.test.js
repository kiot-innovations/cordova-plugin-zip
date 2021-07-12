import React from 'react'

import PVSProvideInternet from '.'

import * as i18n from 'shared/i18n'
import { rmaModes } from 'state/reducers/rma'

describe('PVS Provide Internet page', () => {
  let initialState = {
    rma: {
      rmaMode: rmaModes.REPLACE_PVS
    },
    firmwareUpdate: { canContinue: true },
    pvs: {
      serialNumber: 'ZT188585000882A8888'
    },
    global: {
      canAccessScandit: true
    },
    inventory: {
      bom: []
    },
    systemConfiguration: {
      network: {
        isConnected: false,
        isFetching: false,
        connectedToAP: { label: '', value: '', ap: null },
        selectedAP: { ssid: '' },
        aps: [],
        wpsConnectionStatus: 'idle'
      },
      interfaces: {
        data: [
          {
            interface: 'wan',
            state: 'disconnected',
            link: 'disconnected',
            sms: 'unreachable',
            internet: 'down',
            ipaddr: ''
          },
          {
            interface: 'plc',
            state: 'disconnected',
            link: 'disconnected',
            pairing: 'unpaired',
            internet: 'down',
            ipaddr: '',
            speed: '0MBps',
            sms: 'unreachable'
          },
          {
            interface: 'sta0',
            status: 'disconnected',
            link: 'disconnected',
            sms: 'unreachable',
            ssid: '',
            internet: 'down',
            ipaddr: '',
            signal: ''
          },
          {
            interface: 'cell',
            internet: 'down',
            ipaddr: '',
            is_primary: 'false',
            link: 'disconnected',
            modem: 'MODEM_OK',
            provider: 'AT&T',
            signal: '-87',
            sim: 'SIM_READY',
            sms: 'unreachable',
            state: 'down',
            status: 'REGISTERED_HOME'
          }
        ],
        error: null,
        isFetching: false
      }
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
    const { component } = mountWithProvider(<PVSProvideInternet />)(
      initialState
    )
    expect(component).toMatchSnapshot()
  })
})
