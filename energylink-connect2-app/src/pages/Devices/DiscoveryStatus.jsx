import React from 'react'
import { is } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

function DiscoveryStatus({
  error,
  expected,
  okMICount,
  errMICount,
  claimError,
  claimingDevices,
  claimDevices,
  claimProgress,
  discoveryComplete,
  retryDiscovery
}) {
  const t = useI18n()
  if (
    expected === okMICount + errMICount &&
    discoveryComplete &&
    !claimingDevices
  ) {
    if (errMICount > 0) {
      return (
        <>
          <button
            className="button is-primary is-uppercase is-paddingless is-fullwidth"
            onClick={retryDiscovery}
          >
            {t('RETRY')}
          </button>
          <span className="has-text-weight-bold mt-20">{t('MI_ERRORS')}</span>
        </>
      )
    }

    if (error) {
      return (
        <>
          <button
            className="button is-primary is-uppercase is-paddingless is-fullwidth"
            onClick={retryDiscovery}
          >
            {t('RETRY')}
          </button>
          <span className="has-text-weight-bold mt-20">
            {t(is(String, error) ? error : 'DEVICE_UNKNOWN_ERROR')}
          </span>
        </>
      )
    }

    if (claimError) {
      return (
        <>
          <span className="has-text-weight-bold mb-20">
            {t('CLAIM_DEVICES_ERROR', claimError)}
          </span>
          <div className="inline-buttons">
            <button
              className="button is-primary is-outlined is-uppercase is-paddingless mb-10"
              disabled={claimingDevices}
              onClick={retryDiscovery}
            >
              {t('ADD-DEVICES')}
            </button>
            <button
              className={'button is-primary is-uppercase'}
              disabled={claimingDevices}
              onClick={claimDevices}
            >
              {either(claimingDevices, `${claimProgress}%`, t('CLAIM_DEVICES'))}
            </button>
          </div>
        </>
      )
    }

    return (
      <div className="inline-buttons">
        <button
          className="button is-primary is-outlined is-uppercase is-paddingless mb-10"
          disabled={claimingDevices}
          onClick={retryDiscovery}
        >
          {t('ADD-DEVICES')}
        </button>
        <button
          className={'button is-primary is-uppercase'}
          disabled={claimingDevices}
          onClick={claimDevices}
        >
          {either(claimingDevices, `${claimProgress}%`, t('CLAIM_DEVICES'))}
        </button>
      </div>
    )
  } else {
    return error && discoveryComplete ? (
      <>
        <button
          className="button is-primary is-uppercase is-paddingless is-fullwidth"
          onClick={retryDiscovery}
        >
          {t('RETRY')}
        </button>
        <span className="has-text-weight-bold mt-20">
          {t(is(String, error) ? error : 'DEVICE_UNKNOWN_ERROR')}
        </span>
      </>
    ) : (
      <span className="has-text-weight-bold mb-20">
        {either(
          claimingDevices,
          <div className="inline-buttons">
            <button
              className="button is-primary is-outlined is-uppercase is-paddingless mb-10"
              disabled={claimingDevices}
              onClick={retryDiscovery}
            >
              {t('ADD-DEVICES')}
            </button>
            <button
              className={'button is-primary is-uppercase'}
              disabled={claimingDevices}
              onClick={claimDevices}
            >
              {either(claimingDevices, `${claimProgress}%`, t('CLAIM_DEVICES'))}
            </button>
          </div>,
          t('DISCOVERY_IN_PROGRESS')
        )}
      </span>
    )
  }
}

export default DiscoveryStatus
