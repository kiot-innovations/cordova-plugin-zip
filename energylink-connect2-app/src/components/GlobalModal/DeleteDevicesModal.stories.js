import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import DeleteDvicesModal from './DeleteDevicesModal'

import { configureStore } from 'state/store'

storiesOf('DeleteDevicesModal', module)
  .add('loading', () => {
    const { store } = configureStore({
      rma: {
        deletingMIs: true,
        deletingMIsError: false
      }
    })

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <DeleteDvicesModal />
        </Provider>
      </div>
    )
  })
  .add('success', () => {
    const { store } = configureStore({
      rma: {
        deletingMIs: false,
        deletingMIsError: false
      }
    })

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <DeleteDvicesModal />
        </Provider>
      </div>
    )
  })
  .add('error', () => {
    const { store } = configureStore({
      rma: {
        deletingMIs: false,
        deletingMIsError: true
      }
    })

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <DeleteDvicesModal />
        </Provider>
      </div>
    )
  })
