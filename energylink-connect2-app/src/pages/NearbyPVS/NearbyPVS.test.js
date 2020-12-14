import * as i18n from 'shared/i18n'
import NearbyPVS from './index'
import React from 'react'
import * as reactRedux from 'react-redux'

describe('RMA devices component', () => {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const initialState = {
      network: {
        bleSearching: false,
        nearbyDevices: [
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' },
          { name: 'ZT0213423569034' }
        ],
        bluetoothStatus: '',
        err: '',
        connected: false
      }
    }

    const { component } = mountWithProvider(<NearbyPVS />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
