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

      <div className="main-container">
        <div className="logo-container has-text-centered">
          <Logo className="logo" />
          <span className="is-uppercase has-text-white is-bold pt-20">
            {t('APP_NAME')}
          </span>
        </div>

        <div className="data has-text-white has-text-centered">
          <span className="has-text-white is-bold pb-10">{t('VERSION')}</span>
          <span className="is-size-4 is-bold">{appVersion()}</span>
        </div>
      </div>
    </section>
  )
}

export default VersionInformation
