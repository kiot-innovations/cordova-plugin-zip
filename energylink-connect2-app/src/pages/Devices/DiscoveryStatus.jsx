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
  retryDiscovery,
  cleanAndGoBack,
  areOnboardMetersMissing
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
          <div className="has-text-centered mb-10">
            <span className="has-text-weight-bold mt-20">
              {t('NOT_FOUND_MIS')}
            </span>
          </div>
          <div className="is-flex">
            <button
              className="button is-primary is-uppercase is-outlined is-fullwidth mr-10"
              onClick={cleanAndGoBack}
            >
              {t('GO_BACK')}
            </button>
            <button
              onClick={retryDiscovery}
              className="button is-primary is-uppercase is-fullwidth ml-10"
            >
              {t('RETRY')}
            </button>
          </div>
        </>
      )
    }

    if (error) {
      return (
        <>
          <div className="has-text-centered mb-10">
            <span className="has-text-weight-bold mt-20">
              {t(is(String, error) ? error : 'DEVICE_UNKNOWN_ERROR')}
            </span>
          </div>
          <div className="is-flex">
            <button
              className="button is-primary is-uppercase is-outlined is-fullwidth mr-10"
              onClick={cleanAndGoBack}
            >
              {t('GO_BACK')}
            </button>
            <button
              onClick={retryDiscovery}
              className="button is-primary is-uppercase is-fullwidth ml-10"
            >
              {t('RETRY')}
            </button>
          </div>
        </>
      )
    }

    if (claimError) {
      return (
        <>
          <div>
            <span className="has-text-weight-bold mb-20">
              {t('CLAIM_DEVICES_ERROR', claimError)}
            </span>
          </div>
          <div className="is-flex">
            <button
              className="button is-primary is-outlined is-uppercase is-fullwidth mr-10"
              disabled={claimingDevices}
              onClick={cleanAndGoBack}
            >
              {t('ADD_DEVICES')}
            </button>
            <button
              className="button is-primary is-uppercase is-fullwidth ml-10 claim-devices-button"
              disabled={
                claimingDevices || areOnboardMetersMissing || !discoveryComplete
              }
              onClick={claimDevices}
            >
              {either(claimingDevices, `${claimProgress}%`, t('CLAIM_DEVICES'))}
            </button>
          </div>
        </>
      )
    }

    return (
      <div className="is-flex">
        <button
          className="button is-primary is-outlined is-uppercase is-fullwidth mr-10"
          disabled={claimingDevices}
          onClick={cleanAndGoBack}
        >
          {t('ADD_DEVICES')}
        </button>
        <button
          className="button is-primary is-uppercase is-fullwidth ml-10 claim-devices-button"
          disabled={
            claimingDevices || areOnboardMetersMissing || !discoveryComplete
          }
          onClick={claimDevices}
        >
          {either(claimingDevices, `${claimProgress}%`, t('CLAIM_DEVICES'))}
        </button>
      </div>
    )
  } else {
    return error && discoveryComplete ? (
      <>
        <div className="has-text-centered mb-10">
          <span className="has-text-weight-bold">
            {t(is(String, error) ? error : 'DEVICE_UNKNOWN_ERROR')}
          </span>
        </div>
        <div className="is-flex">
          <button
            className="button is-primary is-uppercase is-outlined is-fullwidth mr-10"
            onClick={cleanAndGoBack}
          >
            {t('GO_BACK')}
          </button>
          <button
            onClick={retryDiscovery}
            className="button is-primary is-uppercase is-fullwidth ml-10"
          >
            {t('RETRY')}
          </button>
        </div>
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
              {t('ADD_DEVICES')}
            </button>
            <button
              className="button is-primary is-uppercase claim-devices-button"
              disabled={
                claimingDevices || areOnboardMetersMissing || !discoveryComplete
              }
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
