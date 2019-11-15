import React from 'react'
import { Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { configureStore } from 'state/store'

const { store, persistor } = configureStore({})

const Router = process.env.REACT_APP_IS_MOBILE
  ? require('react-router-dom').HashRouter
  : require('react-router-dom').BrowserRouter

export default ({ children }) => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <Switch>{children}</Switch>
      </Router>
    </PersistGate>
  </Provider>
)
