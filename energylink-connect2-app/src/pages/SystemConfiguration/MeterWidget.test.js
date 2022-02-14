import React from 'react'
import * as reactRedux from 'react-redux'

import MeterWidgets from './MetersWidget'

import * as i18n from 'shared/i18n'

describe('Meter Widget', () => {
  let dispatchMock

  let initialState = {
    inventory: { bom: [{ item: 'ESS', value: '0' }] },
    systemConfiguration: {
      meter: {
        consumptionCT: 1,
        productionCT: 1,
        ratedCurrent: 100
      }
    },
    pvs: {
      model: 'PVS5'
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
    const { component } = mountWithProvider(<MeterWidgets />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
