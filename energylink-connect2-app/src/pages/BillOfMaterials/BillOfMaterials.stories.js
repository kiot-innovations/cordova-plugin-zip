import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import BillOfMaterials from '.'

import { configureStore } from 'state/store'

storiesOf('BillOfMaterials Page', module)
  .add('Non-commissioned site', () => {
    const { store } = configureStore({
      site: {
        site: {
          siteName: 'Rick Mellor',
          address1: '6530 Morris Avenue - Cash - 1607962'
        },
        sitePVS: null
      }
    })

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <BillOfMaterials />
        </Provider>
      </div>
    )
  })
  .add('Commissioned site', () => {
    const { store } = configureStore({
      site: {
        site: {
          siteName: 'Rick Mellor',
          address1: '6530 Morris Avenue - Cash - 1607962'
        },
        sitePVS: [
          {
            deviceSerialNumber: 'ZT190885000549A1374',
            assignmentEffectiveTimestamp: '2020-08-07T03:49:19.278Z'
          }
        ]
      }
    })

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <BillOfMaterials />
        </Provider>
      </div>
    )
  })
