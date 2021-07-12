import { pathOr } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'

import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import './FallbackUI.scss'

function FallBackUI(props) {
  const t = useI18n()
  const message = pathOr('', ['error', 'message'], props)
  return (
    <section className="fbui pr-15 pl-15">
      <h1 className="is-size-3 has-text-white has-text-centered">{t('UPS')}</h1>
      <p className="mt-20 has-text-centered">{t('UPS_TEXT')}</p>

      <p className="error-message is-size-5 mt-20 pl-10 pr-10 pt-10 pb-10">
        {message}
      </p>

      <div className="is-flex">
        <Link
          className="button is-primary is-fullwidth is-uppercase"
          to={paths.PROTECTED.BILL_OF_MATERIALS.path}
        >
          {t('START_OVER')}
        </Link>
      </div>
    </section>
  )
}

export default FallBackUI
