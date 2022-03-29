import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import PCS from '.'

import { configureStore } from 'state/store'

const initialState = {
  pcs: {
    busBarRating: 55,
    breakerRating: 50,
    hubPlusBreakerRating: 50,
    enablePCS: true
  }
}

storiesOf('Power Control System (PCS)', module)
  .add('Default', () => {
    const { store } = configureStore(initialState)
    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <PCS />
        </Provider>
      </div>
    )
  })
  .add('Fetching PCS Settings', () => {
    const state = {
      ...initialState
    }
    state.pcs.fetchingPCS = true
    const { store } = configureStore(state)
    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <PCS />
        </Provider>
      </div>
    )
  })
  .add('Fetching PCS Settings Error', () => {
    const state = {
      ...initialState,
      fetchingPCS: false
    }
    state.pcs.fetchingPCS = false
    state.pcs.fetchingPCSSettingsError = true

    const { store } = configureStore(state)
    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <PCS />
        </Provider>
      </div>
    )
  })
