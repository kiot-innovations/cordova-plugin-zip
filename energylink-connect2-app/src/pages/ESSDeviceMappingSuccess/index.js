import React from 'react'
import { useI18n } from 'shared/i18n'
import './ESSDeviceMappingSuccess.scss'

function DeviceMappingSuccess() {
  const t = useI18n()

  return (
    <section className="version-info is-flex tile is-vertical has-text-weight-bold pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">
        {t('DEVICE_MAP')}
      </h1>
    </section>
  )
}

export default DeviceMappingSuccess
