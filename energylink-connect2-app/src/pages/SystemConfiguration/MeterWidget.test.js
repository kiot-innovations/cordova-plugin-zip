import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import MeterWidgets from './MetersWidget'

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
