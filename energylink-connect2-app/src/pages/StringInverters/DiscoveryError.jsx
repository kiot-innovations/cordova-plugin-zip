import { path } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import SwipeableSheet from 'hocs/SwipeableSheet'
import useRetryStringInverterDiscovery from 'hooks/useRetryLegacyDiscovery'
import { useI18n } from 'shared/i18n'

const DiscoveryError = () => {
  const t = useI18n()
  const discoveryError = useSelector(path(['devices', 'error']))
  const reDiscover = useRetryStringInverterDiscovery()

  const [hasError, setError] = useState(discoveryError)

  useEffect(() => {
    setError(discoveryError)
  }, [discoveryError])

  const retryDiscovery = close => {
    setError(!close)
    return reDiscover()
  }
  return (
    <SwipeableSheet open={hasError} onChange={() => retryDiscovery(false)}>
      <div className="tile flex-column is-flex full-height string-inverters">
        <span className="has-text-white has-text-centered mb-20 is-capitalized">
          {t('ERROR')}
        </span>
        <p className="has-text-centered">{t('DISCOVERY_ERROR')}</p>
        <button
          className="is-uppercase is-uppercase is-primary button mt-20"
          onClick={() => retryDiscovery(true)}
        >
          {t('RETRY')}
        </button>
      </div>
    </SwipeableSheet>
  )
}

export default DiscoveryError
