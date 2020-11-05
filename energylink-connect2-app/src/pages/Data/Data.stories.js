import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import Data from '.'

const noMeters = {
  devices: {
    found: [
      {
        SERIAL: 'ProductionMeter001p',
        DEVICE_TYPE: 'Power Meter',
        SUBTYPE: 'NOT_USED'
      },
      {
        SERIAL: 'ConsumptionMeter001c',
        DEVICE_TYPE: 'Power Meter',
        SUBTYPE: 'NOT_USED'
      }
    ]
  },
  energyLiveData: {
    liveData: {
      [new Date().toISOString()]: {
        ess_en: -162.80300000000005,
        ess_p: -0.041,
        net_en: -2157.16,
        net_p: -0.8628927917480469,
        pv_en: 2228.32,
        pv_p: 0.8872415161132813,
        site_load_en: -91.64299999999974,
        site_load_p: -0.016651275634765615,
        soc: 0.9500000000000001,
        rawData: {
          ess_en: -162.80300000000005,
          ess_p: -0.041,
          net_en: -2157.16,
          net_p: -0.8628927917480469,
          pv_en: 2228.32,
          pv_p: 0.8872415161132813,
          site_load_en: -91.64299999999974,
          site_load_p: -0.016651275634765615,
          soc: 0.9500000000000001
        }
      }
    }
  }
}
const withMeters = {
  devices: {
    found: [
      {
        SERIAL: 'ProductionMeter001p',
        DEVICE_TYPE: 'Power Meter',
        SUBTYPE: 'GROSS_PRODUCTION_LINESIDE'
      },
      {
        SERIAL: 'ConsumptionMeter001c',
        DEVICE_TYPE: 'Power Meter',
        SUBTYPE: 'NOT_USED'
      }
    ]
  },
  energyLiveData: {
    liveData: {
      [new Date().toISOString()]: {
        ess_en: -162.80300000000005,
        ess_p: -0.041,
        net_en: -2157.16,
        net_p: -0.8628927917480469,
        pv_en: 2228.32,
        pv_p: 0.8872415161132813,
        site_load_en: -91.64299999999974,
        site_load_p: -0.016651275634765615,
        soc: 0.9500000000000001,
        rawData: {
          ess_en: -162.80300000000005,
          ess_p: -0.041,
          net_en: -2157.16,
          net_p: -0.8628927917480469,
          pv_en: 2228.32,
          pv_p: 0.8872415161132813,
          site_load_en: -91.64299999999974,
          site_load_p: -0.016651275634765615,
          soc: 0.9500000000000001
        }
      }
    }
  }
}

storiesOf('Data', module)
  .add('With Meters', () => {
    const { store } = configureStore(withMeters)

    return (
      <div className="full-min-height pt-20 pb-20 pl-10 pr-10">
        <Provider store={store}>
          <Data />
        </Provider>
      </div>
    )
  })
  .add('Without Meter Configs', () => {
    const { store } = configureStore(noMeters)

    return (
      <div className="full-min-height pt-20 pb-20 pl-10 pr-10">
        <Provider store={store}>
          <Data />
        </Provider>
      </div>
    )
  })
