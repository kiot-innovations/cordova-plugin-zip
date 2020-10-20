import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import RMAInventory from './index'

const inventoryStore = {
  inventory: {
    bom: [
      { item: 'AC_MODULES', value: '0' },
      { item: 'DC_MODULES', value: '0' },
      { item: 'STRING_INVERTERS', value: '0' },
      { item: 'EXTERNAL_METERS', value: '0' },
      { item: 'ESS', value: '0' }
    ],
    rma: {
      other: true
    }
  }
}

storiesOf('RMA - Inventory', module).add('Simple', () => {
  const { store } = configureStore(inventoryStore)

  return (
    <div className="full-min-height">
      <Provider store={store}>
        <RMAInventory />
      </Provider>
    </div>
  )
})
