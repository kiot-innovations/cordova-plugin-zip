import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import './ESScontinueFooter.scss'

const ContinueFooter = ({ url = '', text = '' }) => {
  const t = useI18n()
  return (
    <div className="continue-footer">
      <span className="is-size-6 has-text-white has-text-weight-bold">
        {t('NO_ERRORS_DETECTED')}
      </span>
      {text && <span className="is-size-6">{t(text)}</span>}
      <Link className="button is-primary is-uppercase mt-20" to={url}>
        {t('CONTINUE')}
      </Link>
    </div>
  )
}

export default ContinueFooter
