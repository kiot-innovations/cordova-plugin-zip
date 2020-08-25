import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import { configureStore } from 'state/store'

import Banner from 'components/Banner'
import Footer from 'components/Footer'
import ModalWrapper from 'components/GlobalModal/Wrapper'
import Header from 'components/Header'
import Routes from 'routes'

const { store, persistor } = configureStore({})

if (window && window.StatusBar) {
  window.StatusBar.backgroundColorByHexString('#15202e')
}

const App = props => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <Banner />
        <Header />
        <Routes />
        <Footer />
        <ModalWrapper />
      </Router>
    </PersistGate>
  </Provider>
)

export default App
