import React from 'react'
import { either } from 'shared/utils'
import { useI18n } from 'shared/i18n'
import { Loader } from 'components/Loader'
import './ESScontinueFooter.scss'

const StorageSyncFooter = ({
  submitting = false,
  commissioned = false,
  error = false,
  sync,
  clear
}) => {
  const t = useI18n()
  return (
    <div className="continue-footer">
      {either(
        commissioned || submitting || error,
        <>
          {either(
            submitting,
            <>
              <span className="has-text-weight-bold has-text-white">
                {t('HOLD_ON')}
              </span>
              <span className="has-text-white mt-10 mb-10">
                {t('ADDING_DEVICES')}
              </span>
              <Loader />
              <span className="has-text-weight-bold mt-10">
                {t('DONT_CLOSE_APP')}
              </span>
            </>
          )}
          {either(
            error,
            <>
              <span className="has-text-weight-bold">{t('ERROR')}</span>
              <div className="mt-10 mb-10">
                <span className="is-size-4 sp-hey has-text-white" />
              </div>
              <div className="mt-10">
                <span>{t('ADDING_DEVICES_ERROR')}</span>
              </div>
              <div className="mt-10 has-text-centered">
                <span>
                  <button className="button is-primary" onClick={sync}>
                    {t('RETRY')}
                  </button>
                </span>
              </div>
            </>
          )}
          {either(
            commissioned,
            <>
              <span className="has-text-weight-bold">{t('SUCCESS')}</span>
              <span className="mt-10 mb-10">{t('ADDING_DEVICES_SUCCESS')}</span>
              <div className="mt-10 mb-10">
                <span className="is-size-4 sp-check has-text-white" />
              </div>
              <div className="mt-10 has-text-centered">
                <span>
                  <button className="button is-primary" onClick={clear}>
                    {t('CONTINUE')}
                  </button>
                </span>
              </div>
            </>
          )}
        </>,
        <>
          <span className="is-size-6 has-text-white has-text-weight-bold">
            {t('NO_ERRORS_DETECTED')}
          </span>
          <span className="is-size-6">{t('HEALTH_CHECK_SUCCESSFUL')}</span>
          <button
            className="button is-primary is-uppercase mt-20"
            onClick={sync}
          >
            {t('CONTINUE')}
          </button>
        </>
      )}
    </div>
  )
}

export default StorageSyncFooter
