import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'
import BillOfMaterials from '.'

storiesOf('BillOfMaterials Page', module).add('Simple', () => {
  const { store } = configureStore({
    site: {
      site: {
        siteName: 'Rick Mellor',
        address1: '6530 Morris Avenue - Cash - 1607962'
      }
    },
    user: {
      data: {
        phoneNumber: '939-555-0113'
      }
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
