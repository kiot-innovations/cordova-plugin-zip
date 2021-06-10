import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import appVersion from './macros/appVersion.macro'

import { configureStore } from 'state/store'

import Banner from 'components/Banner'
import Footer from 'components/Footer'
import ModalWrapper from 'components/GlobalModal/Wrapper'
import Header from 'components/Header'
import Routes from 'routes'
import { SENTRY_QUEUE_EVENT, SENTRY_START_LISTENER } from 'state/actions/sentry'
import { CHECK_LOCATION_PERMISSION_INIT } from 'state/actions/permissions'

const { store, persistor } = configureStore({})

if (window && window.StatusBar) {
  window.StatusBar.backgroundColorByHexString('#0c1724')
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  maxBreadcrumbs: 20,
  beforeSend: function(event) {
    if (navigator.onLine) return event
    store.dispatch(SENTRY_QUEUE_EVENT(event))
    return null
  },
  release: appVersion(),
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: process.env.REACT_APP_FLAVOR
})

const App = () => {
  useEffect(() => {
    store.dispatch(SENTRY_START_LISTENER())
    store.dispatch(CHECK_LOCATION_PERMISSION_INIT())
  }, [])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Banner flavor={process.env.REACT_APP_FLAVOR} />
          <Header />
          <Routes />
          <Footer />
          <ModalWrapper />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
