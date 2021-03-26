import React from 'react'
import * as i18n from 'shared/i18n'
import PrecommissioningConfigs from '.'
import { rmaModes } from 'state/reducers/rma'

describe('Precommissioning configurations page', () => {
  let mockState = {
    global: {
      canAccessScandit: true
    },
    rma: {
      rmaMode: rmaModes.NONE
    },
    inventory: {
      bom: [{ item: 'ESS', value: '0' }]
    },
    systemConfiguration: {
      submit: {
        preconfigState: 'NOT_STARTED',
        preconfigError: 'ERROR'
      },
      meter: {
        consumptionCT: 1,
        productionCT: 1,
        ratedCurrent: 100
      },
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
            filename: '816bf330.meta',
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
    devices: {
      found: []
    },
    site: {
      site: {
        siteKey: ''
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
    const { component } = mountWithProvider(<PrecommissioningConfigs />)(
      mockState
    )
    expect(component).toMatchSnapshot()
  })
})
