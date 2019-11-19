import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Routes from 'routes'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { configureStore } from 'state/store'

const { store, persistor } = configureStore({})

const Router = process.env.REACT_APP_IS_MOBILE
  ? require('react-router-dom').HashRouter
  : require('react-router-dom').BrowserRouter

const App = props => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <Header />
        <Routes />
        <Footer />
      </Router>
    </PersistGate>
  </Provider>
)

export default App
