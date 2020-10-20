import React from 'react'
import * as Sentry from '@sentry/browser'
import { either } from 'shared/utils'
import { translate } from 'shared/i18n'
import FallBackUI from './FallbackUI'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error) {
    const t = translate()
    Sentry.addBreadcrumb({
      data: {
        path: window.location.hash,
        environment: process.env.REACT_APP_FLAVOR
      },
      category: t('UPS_SENTRY'),
      message: error.message,
      level: Sentry.Severity.Error
    })
    Sentry.captureException(error)
  }

  render() {
    return either(
      this.state.hasError,
      <FallBackUI error={this.state.error} />,
      this.props.children
    )
  }
}

export default ErrorBoundary
