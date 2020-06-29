import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import './ESScontinueFooter.scss'
const ContinueFooter = ({ url = '' }) => {
  const t = useI18n()
  return (
    <div className="continue-footer">
      <span className="is-size-6">{t('NO_ERRORS_DETECTED')}</span>
      <Link
        className="button is-primary is-uppercase pl-20 pr-20 mt-20"
        to={url}
      >
        {t('CONTINUE')}
      </Link>
    </div>
  )
}

export default ContinueFooter
