import React from 'react'
import { prop } from 'ramda'
import { useI18n } from 'shared/i18n'

const ProgressIndicators = ({ progressList }) => {
  const t = useI18n()
  const miIndicators = {
    OK: <span className="is-size-4 mr-10 sp-check has-text-white" />,
    ERROR: <span className="is-size-4 mr-10 sp-hey has-text-primary" />,
    LOADING: (
      <div className="inline-loader">
        <div className="ball-scale-ripple">
          <div />
        </div>
      </div>
    )
  }

  return progressList.map(deviceType => {
    const progr = prop('PROGR', deviceType)
    const type = prop('TYPE', deviceType)
    const nfound = prop('NFOUND', deviceType)

    if (type !== 'MicroInverters') {
      return (
        <div className="device-prog mb-10 mt-10">
          <div className="device-prog-header">
            <div className="device-prog-title">
              <span className="has-text-centered">
                {progr !== '100' ? miIndicators.LOADING : miIndicators.OK}
              </span>
              <span className="pl-10">{t(type)}</span>
            </div>
            <div className="device-prog-status">
              {progr !== '100' ? `${progr}%` : `${nfound} ${t('FOUND')}`}
            </div>
          </div>
        </div>
      )
    }
  })
}

export default ProgressIndicators
