import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import Banner from 'components/Banner'
import Footer from 'components/Footer'
import ModalWrapper from 'components/GlobalModal/Wrapper'
import HeaderHoc from 'components/Header'
import Routes from 'routes'
import { CHECK_LOCATION_PERMISSION_INIT } from 'state/actions/permissions'
import { configureStore } from 'state/store'

const { store, persistor } = configureStore({})

if (window && window.StatusBar) {
  window.StatusBar.backgroundColorByHexString('#0c1724')
}

const App = () => {
  useEffect(() => {
    store.dispatch(CHECK_LOCATION_PERMISSION_INIT())
  }, [])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Banner flavor={process.env.REACT_APP_FLAVOR} />
          <HeaderHoc />
          <Routes />
          <Footer />
          <ModalWrapper />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
