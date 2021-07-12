import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import Settings from '.'

import { configureStore } from 'state/store'

storiesOf('Settings Page', module)
  .add('Checklist enabled', () => {
    const { store } = configureStore({
      global: {
        showCheckList: true
      }
    })

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <Settings />
        </Provider>
      </div>
    )
  })
  .add('Checklist disabled', () => {
    const { store } = configureStore({
      global: {
        showCheckList: false
      }
    })

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <Settings />
        </Provider>
      </div>
    )
  })
