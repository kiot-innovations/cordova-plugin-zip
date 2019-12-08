import React, { useEffect } from 'react'
import ExampleImage from './assets/example.png'
import { useI18n } from 'shared/i18n'
import { decodeQRData, scanBarcodes } from '../../shared/scanning'
import { connectTo } from '../../state/actions/network'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'

function ConnectToPVS() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const connectionState = useSelector(state => state.network)

  useEffect(() => {
    if (connectionState.connected) {
      history.push(paths.PROTECTED.PVS_CONNECTION_SUCCESS.path)
    }
    if (!connectionState.connecting && connectionState.err) {
      alert('An error occured while connecting to the PVS. Please try again.')
    }
  }, [connectionState, history])

  const generatePwd = sn => {
    let lastIndex = sn.length
    let pwd = sn.substring(2, 6) + sn.substring(lastIndex - 4, lastIndex)
    return pwd
  }

  const connectToWifi = (ssid, pwd) => {
    dispatch(connectTo(ssid, pwd))
  }

  const onSuccess = data => {
    let wifiData

    try {
      wifiData = decodeQRData(data)
    } catch {
      wifiData = ''
    }

    if (wifiData.length > 0) {
      let qrData = wifiData.split('|')
      let serialn = qrData[0]
      let ssid = qrData[1]
      let pwd = generatePwd(serialn)
      connectToWifi(ssid, pwd)
    } else {
      alert(t('INVALID_QRCODE'))
    }
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
        <img
          className="mt-15"
          src={ExampleImage}
          alt={t('EXAMPLE_QR_IMAGE_ALT')}
        />
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
