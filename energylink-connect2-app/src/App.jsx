import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import Routes from 'routes'
import Header from 'components/Header'
import Footer from 'components/Footer'
import { configureStore } from 'state/store'

const { store, persistor } = configureStore({})

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
