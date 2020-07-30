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
            id: '816bf3302d337a42680b996227ddbc46abf9cd05',
            name: 'IEEE-1547a-2014 + 2020 CA Rule21'
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
            id: '816bf3302d337a42680b996227ddbc46abf9cd05',
            name: 'IEEE-1547a-2014 + 2020 CA Rule21'
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

  const gridVoltage208 = {
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
            id: '816bf3302d337a42680b996227ddbc46abf9cd05',
            name: 'IEEE-1547a-2014 + 2020 CA Rule21'
          },
          lazyGridProfile: 0,
          exportLimit: -1
        },
        profiles: [],
        gridVoltage: {
          grid_voltage: 208,
          measured: 208,
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

  test('renders correctly with grid voltage measured equals to 208', () => {
    const { component } = mountWithProvider(<GridBehaviorWidget />)(
      gridVoltage208
    )
    expect(component).toMatchSnapshot()
  })
})
