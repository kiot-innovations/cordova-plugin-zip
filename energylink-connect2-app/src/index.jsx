import 'unfetch/polyfill'
import {
  Offline as OfflineIntegration,
  CaptureConsole as CaptureConsoleIntegration
} from '@sentry/integrations'
import { Integrations } from '@sentry/tracing'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import * as Sentry from 'sentry-cordova'
import '@sunpower/theme-dark'

import 'react-circular-progressbar/dist/styles.css'

import App from './App'
import appVersion from './macros/appVersion.macro'

const setupGA = () => {
  const GAproperty =
    process.env.NODE_ENV === 'production' ? 'UA-150756685-2' : 'UA-150756685-1'
  ReactGA.initialize(GAproperty)
  ReactGA.set({ checkProtocolTask: null })
}

const setupSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    maxBreadcrumbs: 20,
    release: appVersion(),
    environment: process.env.REACT_APP_FLAVOR,
    integrations: [
      new Integrations.BrowserTracing(),
      new OfflineIntegration({ maxStoredEvents: 100 }),
      new CaptureConsoleIntegration({ levels: ['error', 'warn'] })
    ],
    ignoreErrors: ['Websocket']
  })
}

const startApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
  setupGA()
  setupSentry()
}

if (!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}
