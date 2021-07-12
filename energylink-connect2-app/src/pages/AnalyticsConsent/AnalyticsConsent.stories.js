import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import AnalyticsConsent from '.'

import { configureStore } from 'state/store'

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
