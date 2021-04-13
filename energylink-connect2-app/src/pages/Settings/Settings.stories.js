import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'
import Settings from '.'

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
