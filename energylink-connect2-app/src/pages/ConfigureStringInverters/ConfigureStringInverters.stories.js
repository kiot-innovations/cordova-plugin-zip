import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import ConfigureStringInverters from '.'

import { configureStore } from 'state/store'

storiesOf('ConfigureStringInverters', module).add('Header', () => {
  const { store } = configureStore({
    pvs: {
      settingMetadata: false,
      setMetadataStatus: 'success'
    }
  })

  return (
    <div className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <ConfigureStringInverters />
      </Provider>
    </div>
  )
})
