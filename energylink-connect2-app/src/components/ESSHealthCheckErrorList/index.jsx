import React from 'react'
import { useHistory } from 'react-router-dom'
import { map, isEmpty, isNil } from 'ramda'
import { useI18n } from 'shared/i18n'
import { getError } from 'shared/errorCodes'
import marked from 'marked'

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

      <div className="mt-15">{map(renderErrors(t), errors)}</div>

      <button className="button is-secondary auto" onClick={history.goBack}>
        {t('BACK')}
      </button>
    </div>
  )
}

const renderErrors = t => err => {
  const { error_code, error_message, last_occurrence, value, ...rest } = err

  const errorByCode = getError(parseInt(error_code, 10))

  if (!errorByCode) return null

  const {
    display,
    in_use,
    error_description,
    possible_causes,
    recommended_actions
  } = errorByCode

  if (!display || !in_use) return null

  const message =
    !isEmpty(error_description) && !isNil(error_description)
      ? error_description
      : error_message

  const recommendatios = { __html: marked(recommended_actions) }

  return (
    <div className="mb-10">
      <Collapsible title={message}>
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

        <div className="collapsible mt-10 mb-15">
          <p className="has-text-white">{t('POSSIBLE_CAUSES')}</p>
          <p>{possible_causes}</p>
        </div>

        <div className="collapsible">
          <p className="has-text-white">{t('ACTIONS')}</p>
          <p dangerouslySetInnerHTML={recommendatios} />
        </div>
      </Collapsible>
    </div>
  )
}

export default ESSHealthCheckErrorList
