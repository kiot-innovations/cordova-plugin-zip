import React from 'react'
import ExampleImage from './assets/example.png'
import { useI18n } from 'shared/i18n'
import { scanBarcodes } from '../../shared/utils'

function ConnectToPVS() {
  const t = useI18n()

  const onSuccess = data => {
    alert(data.text)
  }

  const onFail = err => {
    alert(err)
  }

  return (
    <div className="is-vertical has-text-centered">
      <span className="is-uppercase has-text-weight-bold mb-40">
        {t('LOOK_FOR_QR')}
      </span>
      <div className="example-image mt-20 mb-20">
        <span>{t('EXAMPLE_IMAGE')}</span>
        <img className="mt-15" src={ExampleImage} alt="" />
      </div>
      <button
        className="button is-primary"
        onClick={() => scanBarcodes(onSuccess, onFail)}
      >
        {t('START_SCAN')}
      </button>
    </div>
  )
}

export default ConnectToPVS
