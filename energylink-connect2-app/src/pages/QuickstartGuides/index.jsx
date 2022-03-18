import React from 'react'
import { useHistory } from 'react-router-dom'

import QuickstartGuideButton from './QuickstartGuideButton'

import { useI18n } from 'shared/i18n'

function QuickstartGuides() {
  const history = useHistory()
  const t = useI18n()

  const goBack = () => history.goBack()

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <div className="header mb-15">
        <span
          className="sp-chevron-left has-text-primary is-size-4 go-back"
          onClick={goBack}
        />
        <span className="is-uppercase" role="button">
          {t('QUICKSTART_GUIDES')}
        </span>
      </div>
      <QuickstartGuideButton
        title={t('EQUINOX_AC_MODULES')}
        link={process.env.REACT_APP_EQUINOX_AC_MODULES}
      />
      <QuickstartGuideButton
        title={t('SUNVAULT_COMMISSIONING')}
        link={process.env.REACT_APP_SUNVAULT_COMMISSIONING}
      />
    </section>
  )
}

export default QuickstartGuides
