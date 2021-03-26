import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import PrecommissioningConfigs from '.'
import { rmaModes } from 'state/reducers/rma'

const mockStore = {
  global: {
    canAccessScandit: true
  },
  rma: {
    rmaMode: rmaModes.NONE
  },
  inventory: {
    bom: [
      { item: 'AC_MODULES', value: '0' },
      { item: 'DC_MODULES', value: '0' },
      { item: 'STRING_INVERTERS', value: '0' },
      { item: 'EXTERNAL_METERS', value: '0' },
      { item: 'ESS', value: '0' }
    ]
  },
  systemConfiguration: {
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
      siteKey: 'ABCDE'
    }
  }
}

storiesOf('Precommissioning Configs', module).add('Config is valid', () => {
  const { store } = configureStore(mockStore)

  return (
    <div className="full-min-height pt-20 pb-20">
      <Provider store={store}>
        <PrecommissioningConfigs />
      </Provider>
    </div>
  )
})
