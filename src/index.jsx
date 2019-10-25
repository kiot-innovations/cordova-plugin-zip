import 'unfetch/polyfill' // Fetch polyfill

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ReactGA from 'react-ga'
import { configureStore } from './state/store'
import Router from './pages/Router'

import '@sunpower/theme-dark'

const { store, persistor } = configureStore({})

const GAproperty = process.env.REACT_APP_IS_MOBILE
  ? (process.env.NODE_ENV === 'production' ? 'UA-144696103-4' : 'UA-144696103-4') // eslint-disable-line
  : (process.env.NODE_ENV === 'production' ? 'UA-144696103-1' : 'UA-144696103-2') // eslint-disable-line

ReactGA.initialize(GAproperty)
ReactGA.set({ checkProtocolTask: null })
ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
