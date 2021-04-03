import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useLottie } from 'lottie-react'

import { useI18n } from 'shared/i18n'
import analyticsAnimation from 'shared/animations/Analytics.json'

import './AnalyticsConsent.scss'
import { trackingPermissionValues } from 'state/reducers/permissions'

function AnalyticsConsent() {
  const t = useI18n()
  const history = useHistory()

  const { trackingPermission } = useSelector(state => state.permissions)

  const { View } = useLottie({
    animationData: analyticsAnimation,
    loop: false,
    autoplay: true
  })

  const consentAnalytics = () => {
    window.cordova.plugins.diagnostic.switchToSettings()
  }

  const exitApp = () => {
    navigator.app.exitApp()
  }

  useEffect(() => {
    if (
      trackingPermission ===
      trackingPermissionValues.TRACKING_PERMISSION_AUTHORIZED
    ) {
      history.goBack()
    }
  }, [trackingPermission, history])

  return (
    <div className="analytics-consent is-flex pl-15 pr-15 has-text-white has-text-centered">
      <div className="animation">{View}</div>
      <div className="mt-10 mb-10">
        <span>{t('CONSENT_ANALYTICS_1')}</span>
      </div>
      <div className="mb-10">
        <span>{t('CONSENT_ANALYTICS_2')}</span>
      </div>
      <div className="is-flex">
        <button
          onClick={exitApp}
          className="button is-primary is-outlined is-fullwidth mr-10"
        >
          {t('CLOSE_APP')}
        </button>
        <button
          onClick={consentAnalytics}
          className="button is-primary is-fullwidth ml-10"
        >
          {t('OK')}
        </button>
      </div>
    </div>
  )
}

export default AnalyticsConsent
