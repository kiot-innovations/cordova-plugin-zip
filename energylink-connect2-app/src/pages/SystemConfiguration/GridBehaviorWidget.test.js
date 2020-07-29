import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import GridBehaviorWidget from './GridBehaviorWidget'

describe('GridBehaviorWidget', () => {
  let dispatchMock

  const gridVoltageZero = {
    systemConfiguration: {
      gridBehavior: {
        selectedOptions: {
          gridVoltage: 240,
          profile: {
            selfsupply: false,
            zipcodes: [
              {
                max: 96162,
                min: 90001
              }
            ],
            filename: 'cb8e4e2f.meta',
            id: 'cb8e4e2f365c5cd1434dd678566a208f0c866661',
            name: 'CA CPUC R21 Reactive Power Priority'
          },
          lazyGridProfile: 0,
          exportLimit: -1
        },
        profiles: [],
        gridVoltage: {
          grid_voltage: 240,
          measured: 0,
          selected: 0
        }
      }
    },
    site: {}
  }

  const gridVoltage240 = {
    systemConfiguration: {
      gridBehavior: {
        selectedOptions: {
          gridVoltage: 240,
          profile: {
            selfsupply: false,
            zipcodes: [
              {
                max: 96162,
                min: 90001
              }
            ],
            filename: 'cb8e4e2f.meta',
            id: 'cb8e4e2f365c5cd1434dd678566a208f0c866661',
            name: 'CA CPUC R21 Reactive Power Priority'
          },
          lazyGridProfile: 0,
          exportLimit: -1
        },
        profiles: [],
        gridVoltage: {
          grid_voltage: 240,
          measured: 240,
          selected: 0
        }
      }
    },
    site: {}
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

  test('renders correctly with grid voltage measured equals to 0', () => {
    const { component } = mountWithProvider(<GridBehaviorWidget />)(
      gridVoltageZero
    )
    expect(component).toMatchSnapshot()
  })

  test('renders correctly with grid voltage measured equals to 240', () => {
    const { component } = mountWithProvider(<GridBehaviorWidget />)(
      gridVoltage240
    )
    expect(component).toMatchSnapshot()
  })
})
