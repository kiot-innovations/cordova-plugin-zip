import React from 'react'
import { useI18n } from 'shared/i18n'
import { useHistory } from 'react-router-dom'
import appVersion from '../../macros/appVersion.macro'
import Logo from '@sunpower/sunpowerimage'
import paths from 'routes/paths'
import './VersionInformation.scss'

function VersionInformation() {
  const t = useI18n()
  const history = useHistory()
  const isTest = process.env.REACT_APP_IS_TEST || process.env.REACT_APP_IS_DEV

  return (
    <section className="version-info is-flex tile is-vertical has-text-weight-bold pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">
        {t('VERSION_INFORMATION')}
      </h1>

      <div className="main-container">
        <div className="logo-container has-text-centered">
          <Logo className="logo" />
          <span className="is-uppercase has-text-white pt-20">
            {t('APP_NAME')}
          </span>
        </div>

        <div className="data has-text-white has-text-centered">
          <span className="has-text-white pb-10">{t('VERSION')}</span>
          <span className="is-size-4">{appVersion()}</span>

          {isTest && (
            <button
              onClick={() => history.push(paths.PROTECTED.DEBUG_PAGE.path)}
              className="button is-primary is-outlined mt-15"
            >
              {t('DEBUG_ROUTES')}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default VersionInformation
