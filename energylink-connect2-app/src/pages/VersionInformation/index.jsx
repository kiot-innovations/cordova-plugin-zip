import React from 'react'
import { useI18n } from 'shared/i18n'
import appVersion from '../../macros/appVersion.macro'

function VersionInformation() {
  const t = useI18n()

  return (
    <section className="is-flex tile is-vertical section pt-0 fill-parent">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold pb-20">
        {t('VERSION_INFORMATION')}
      </h1>
      <h1 className="has-text-centered is-uppercase has-text-weight-bold pb-20">
        {appVersion()}
      </h1>
    </section>
  )
}

export default VersionInformation
