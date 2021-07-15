import React from 'react'

import ListRow from 'components/ListRow'
import { useI18n } from 'shared/i18n'

function KnowledgeBase() {
  const t = useI18n()

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold  pb-20">
        {t('QUICKSTART_GUIDES')}
      </h1>
      <ListRow
        title="Equinox AC Modules"
        link={process.env.REACT_APP_EQUINOX_AC_MODULES}
      />
    </section>
  )
}

export default KnowledgeBase
