import React from 'react'
import { useHistory } from 'react-router-dom'

import { ButtonLink } from 'components/ButtonLink'
import { useI18n } from 'shared/i18n'
import { createExternalLinkHandler } from 'shared/routing'

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
      <ButtonLink
        title="Equinox AC Modules"
        icon="sp-download"
        onClick={createExternalLinkHandler(
          process.env.REACT_APP_EQUINOX_AC_MODULES
        )}
        size={5}
      />
    </section>
  )
}

export default QuickstartGuides
