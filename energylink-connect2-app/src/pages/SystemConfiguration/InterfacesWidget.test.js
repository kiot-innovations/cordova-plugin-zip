import React from 'react'
import * as reactRedux from 'react-redux'

import InterfacesWidget from './InterfacesWidget'

import * as i18n from 'shared/i18n'

describe('Interfaces Widget', () => {
  let dispatchMock

  let initialState = {
    pvs: {
      serialNumber: 'ZT188585000882A8888'
    },
    systemConfiguration: {
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
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<InterfacesWidget />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
