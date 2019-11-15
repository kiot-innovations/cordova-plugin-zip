import 'unfetch/polyfill' // Fetch polyfill

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ReactGA from 'react-ga'
import Routes from './routes'
import { configureStore } from './state/store'
import Header from 'components/Header'
import '@sunpower/theme-dark'
import Footer from 'components/footer/Footer'

const { store, persistor } = configureStore({})

const GAproperty = process.env.REACT_APP_IS_MOBILE
  ? process.env.NODE_ENV === 'production'
    ? 'UA-150756685-2'
    : 'UA-150756685-1' // eslint-disable-line
  : process.env.NODE_ENV === 'production'
  ? 'UA-150756685-2'
  : 'UA-150756685-1' // eslint-disable-line

ReactGA.initialize(GAproperty)
ReactGA.set({ checkProtocolTask: null })

const Router = process.env.REACT_APP_IS_MOBILE
  ? require('react-router-dom').HashRouter
  : require('react-router-dom').BrowserRouter

const startApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Header />
          <Routes />
          <Footer />
        </Router>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  )
}

if (!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}
