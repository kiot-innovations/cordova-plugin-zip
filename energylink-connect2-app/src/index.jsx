import 'unfetch/polyfill' // Fetch polyfill
import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import '@sunpower/theme-dark'
import App from './App'

const GAproperty = process.env.REACT_APP_IS_MOBILE
  ? process.env.NODE_ENV === 'production'
    ? 'UA-150756685-2'
    : 'UA-150756685-1' // eslint-disable-line
  : process.env.NODE_ENV === 'production'
  ? 'UA-150756685-2'
  : 'UA-150756685-1' // eslint-disable-line

ReactGA.initialize(GAproperty)
ReactGA.set({ checkProtocolTask: null })

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

if (!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}