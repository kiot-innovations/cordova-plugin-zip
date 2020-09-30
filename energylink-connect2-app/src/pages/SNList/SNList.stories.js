import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import SNList from '.'
import SNManualEntry from './SNManualEntry'
import { action } from '@storybook/addon-actions/dist'

storiesOf('Serial Number List Page', module)
  .add('Empty', () => {
    const { store } = configureStore({})
    return (
      <div className="full-min-height">
        <Provider store={store}>
          <SNList />
        </Provider>
      </div>
    )
  })
  .add('SNManualEntry', () => {
    const { store } = configureStore({})

    return (
      <div className="full-min-height pl-10 pr-10">
        <Provider store={store}>
          <SNManualEntry serialNumber="" callback={action('callback called')} />
        </Provider>
      </div>
    )
  })
