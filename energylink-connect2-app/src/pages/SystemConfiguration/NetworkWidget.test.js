import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import NetworkWidget from './NetworkWidget'

describe('Network Widget', () => {
  let dispatchMock

  describe('on initial state', () => {
    let initialState = {
      systemConfiguration: {
        network: {
          aps: [{ ssid: '1' }, { ssid: '2' }],
          selectedAP: { label: '' },
          connectedToAP: { label: '', value: '', ap: { ssid: '' } },
          error: null
        }
      }
    }

    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key, ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    test('renders correctly', () => {
      const { component } = mountWithProvider(<NetworkWidget />)(initialState)
      expect(component).toMatchSnapshot()
    })
  })

  describe('after selecting network', () => {
    let state = {
      systemConfiguration: {
        network: {
          aps: [
            { ssid: '1', label: 'ssid1' },
            { ssid: '2', label: 'ssid2' }
          ],
          selectedAP: {
            ssid: '2',
            rssi: '-43',
            bssid: 'b8:27:eb:4e:54:12',
            frequency: '2442',
            attributes: 'wpa-psk',
            channel: '7'
          },
          connectedToAP: { label: '', value: '', ap: { ssid: '' } },
          error: null
        }
      }
    }

    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key, ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    test('network is selected', () => {
      const { component } = mountWithProvider(<NetworkWidget />)(state)
      expect(component).toMatchSnapshot()
    })
  })
})
