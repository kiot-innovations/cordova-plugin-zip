import React from 'react'

import { useI18n } from 'shared/i18n'

function AppUpdater({ onUpdate }) {
  const t = useI18n()

  return (
    <section className="is-flex tile is-vertical level file">
      <h1 className="has-text-centered">{t('UPDATE_HEADER')}</h1>

      <button
        className="button is-primary mt-30 is-uppercase"
        onClick={onUpdate}
      >
        {t('BTN_UPDATE')}
      </button>
    </section>
  )
}

export default AppUpdater
