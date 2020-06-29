import React from 'react'
import { useI18n } from 'shared/i18n'
import './ESSDeviceMapping.scss'

function DeviceMapping() {
  const t = useI18n()

  return (
    <section className="ess-device-mapping is-flex tile is-vertical has-text-weight-bold pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">
        {t('DEVICE_MAPPING')}
      </h1>

      <div className="main-container">
        <div className="pt-20 pb-20">
          <div className="inline-loader">
            <div className="ball-scale-ripple">
              <div />
            </div>
          </div>
        </div>
        <div>{t('DEVICE_MAPPING_IN_PROGRESS')}</div>
      </div>
    </section>
  )
}

export default DeviceMapping
