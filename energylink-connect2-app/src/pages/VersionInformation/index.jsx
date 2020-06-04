import React from 'react'
import { useI18n } from 'shared/i18n'
import appVersion from '../../macros/appVersion.macro'
import Logo from '@sunpower/sunpowerimage'
import './VersionInformation.scss'

function VersionInformation() {
  const t = useI18n()

  return (
    <section className="version-info is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold pb-20">
        {t('VERSION_INFORMATION')}
      </h1>

      <div className="container">
        <div className="logo">
          <Logo />
        </div>

        <div className="data">{appVersion()}</div>
      </div>
    </section>
  )
}

export default VersionInformation
