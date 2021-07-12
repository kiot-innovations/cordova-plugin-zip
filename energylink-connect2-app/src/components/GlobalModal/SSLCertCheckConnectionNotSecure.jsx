import clsx from 'clsx'
import { path } from 'ramda'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useI18n } from 'shared/i18n'
import { CHECK_SSL_CERTS } from 'state/actions/global'

const SSLCertCheckConnectionInsecure = () => {
  const t = useI18n()
  const dispatch = useDispatch()

  const checkingSSLCerts = useSelector(state =>
    path(['global', 'checkingSSLCerts'], state)
  )

  const retry = () => {
    dispatch(CHECK_SSL_CERTS())
  }

  const retryButonClassName = clsx('button', 'is-primary', 'is-uppercase', {
    'is-loading': checkingSSLCerts
  })

  return (
    <div className="has-text-centered is-flex flex-column">
      <span className="has-text-white mb-10">
        {t('SSL_CERT_CHECK_CONNECTION_NOT_SECURE_BODY')}
      </span>
      <button
        className={retryButonClassName}
        onClick={retry}
        disabled={checkingSSLCerts}
      >
        {t('RETRY')}
      </button>
    </div>
  )
}

export default SSLCertCheckConnectionInsecure
