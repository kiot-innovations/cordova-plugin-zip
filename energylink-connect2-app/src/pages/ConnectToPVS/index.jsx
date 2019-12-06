import React from 'react'
import ExampleImage from './assets/example.png'
import { useI18n } from 'shared/i18n'
import { scanBarcodes } from '../../shared/utils'
import { connectTo } from '../../state/actions/network'
import { useDispatch } from 'react-redux'

function ConnectToPVS() {
  const t = useI18n()
  const dispatch = useDispatch()

  const generatePwd = sn => {
    let lastIndex = sn.length
    let pwd = sn.substring(2, 6) + sn.substring(lastIndex - 4, lastIndex)
    return pwd
  }

  const connectToWifi = (ssid, pwd) => {
    dispatch(connectTo(ssid, pwd))
  }

  const onSuccess = data => {
    let qrData = data.split('|')
    let serialn = qrData[0]
    let ssid = qrData[1]
    let pwd = generatePwd(serialn)
    connectToWifi(ssid, pwd)
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
        <img className="mt-15" src={ExampleImage} />
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
