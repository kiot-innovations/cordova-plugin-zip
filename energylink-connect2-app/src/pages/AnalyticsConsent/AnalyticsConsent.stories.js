import React from 'react'
import { storiesOf } from '@storybook/react'
import { configureStore } from 'state/store'
import { Provider } from 'react-redux'

import AnalyticsConsent from '.'

const mockedState = {}

storiesOf('Analytics Consent Page', module).add('Simple', () => {
  const { store } = configureStore(mockedState)

  return (
    <div className="full-min-height">
      <Provider store={store}>
        <AnalyticsConsent />
      </Provider>
    </div>
  )
})
