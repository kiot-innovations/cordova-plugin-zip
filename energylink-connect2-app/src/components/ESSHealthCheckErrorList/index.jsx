import React from 'react'
import { useHistory } from 'react-router-dom'
import { map } from 'ramda'
import { useI18n } from 'shared/i18n'

import Collapsible from 'components/Collapsible'

import './ESSHealthCheckErrorList.scss'

function ESSHealthCheckErrorList({ results }) {
  const t = useI18n()
  const history = useHistory()

  const { errors = [] } = results
  return (
    <div className="ess-hc page-height has-text-centered pt-10">
      <span className="is-uppercase has-text-weight-bold mb-10">
        {t('HEALTH_REPORT_ERROR_LIST')}
      </span>

      <div>{map(renderErrors(t), errors)}</div>

      <button className="button is-secondary auto" onClick={history.goBack}>
        {t('BACK')}
      </button>
    </div>
  )
}

const renderErrors = t => err => {
  const { error_message, last_occurrence, value, ...rest } = err
  return (
    <div className="mb-10">
      <Collapsible title={error_message}>
        <div>
          <p>
            <span className="mr-5">{t('last_occurrence')}</span>
            <span>{new Date(last_occurrence).toLocaleString()}</span>
          </p>
          {Object.keys(rest).map(ekey => (
            <p>
              <span className="mr-5">{t(ekey)}:</span>
              <span>{err[ekey]}</span>
            </p>
          ))}
        </div>
      </Collapsible>
    </div>
  )
}

export default ESSHealthCheckErrorList
