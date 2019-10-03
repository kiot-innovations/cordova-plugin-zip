import React from 'react'
import { useI18n } from '../../shared/i18n'

import './Reports.scss'

function Reports() {
  const t = useI18n()

  const title = t('REPORTS_TITLE')
  const textt = t('REPORTS_TEXT')
  const descr = t('REPORTS_DESCRIPTION')
  const btntx = t('REPORTS_BTN_TEXT')

  return (
    <div className="reports content">
      <h6 className="has-text-weight-light has-text-grey heading">{title}</h6>
      <h6 className="title mb-0">{textt}</h6>
      <div className="has-text-primary mb-10">_</div>
      <p className="has-text-black">{descr}</p>
      <button className="button is-primary is-fullwidth is-uppercase">
        {btntx}
      </button>
    </div>
  )
}

export default Reports
