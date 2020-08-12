import React, { useEffect, useState } from 'react'
import { pathOr, isEmpty, isNil } from 'ramda'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { either, isAndroid10 } from 'shared/utils'
import { useI18n } from 'shared/i18n'
import { RESET_DISCOVERY } from 'state/actions/devices'
import { RESET_PVS_INFO_STATE } from 'state/actions/pvs'
import {
  RESET_PVS_CONNECTION,
  PVS_CONNECTION_INIT,
  STOP_NETWORK_POLLING,
  clearPVSErr
} from 'state/actions/network'
import { RESET_INVENTORY } from 'state/actions/inventory'
import { RESET_SITE } from 'state/actions/site'
import { RESET_LAST_VISITED_PAGE } from 'state/actions/global'
import paths from 'routes/paths'
import 'pages/ConnectToPVS/ConnectToPVS.scss'
import './ConnectionLost.scss'

const ConnectionLost = ({ animationState }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const [manualInstructions, showManualInstructions] = useState(false)

  const { SSID, password, connected, connecting, err } = useSelector(
    pathOr({}, ['network'])
  )

  const { serialNumber } = useSelector(pathOr({}, ['pvs']))

  const exitSite = () => {
    dispatch(RESET_PVS_INFO_STATE())
    dispatch(RESET_PVS_CONNECTION())
    dispatch(RESET_DISCOVERY())
    dispatch(RESET_INVENTORY())
    dispatch(RESET_SITE())
    dispatch(RESET_LAST_VISITED_PAGE())
    history.push(paths.PROTECTED.ROOT.path)
  }

  const reconnectToPVS = () => {
    dispatch(RESET_DISCOVERY())
    dispatch(PVS_CONNECTION_INIT({ ssid: SSID, password }))
  }

  const copyPasswordToClipboard = () => {
    window.cordova.plugins.clipboard.copy(password)
    window.cordova.plugins.diagnostic.switchToWifiSettings()
  }

  const abortConnection = () => {
    dispatch(STOP_NETWORK_POLLING())
    dispatch(RESET_PVS_CONNECTION())
    showManualInstructions(false)
  }

  const checkAndroidVersion = () => {
    if (isAndroid10) {
      showManualInstructions(true)
    }
  }

  useEffect(() => {
    if (connecting) {
      checkAndroidVersion()
    }
    if (!connecting && connected && animationState !== 'leave') {
      history.push(paths.PROTECTED.SN_LIST.path)
    }
    if (!connecting && err) {
      dispatch(clearPVSErr())
    }
  }, [animationState, connected, connecting, err, dispatch, history, t])

  return (
    <div className="pvs-connection-lost-screen pr-20 pl-20">
      <h2 className="is-uppercase has-text-weight-bold">
        {t('CONNECTION_LOST')}
      </h2>
      <span className="sp-no-connection has-text-white" />

      <div className="mr-5 ml-5 is-size-6 has-text-centered">
        <p>{t('RECONNECT1')}</p>
        <span className="has-text-weight-bold mr-5">{t('RECONNECT')}</span>
        {t('RECONNECT2')}
        <br />
        <p className="has-text-centered mt-20 has-text-weight-bold">
          {serialNumber}
        </p>
        <p className="mt-20">{t('RECONNECT3')}</p>

        {either(err, <div className="message error mb-10 mt-10">{t(err)}</div>)}
      </div>

      <div className="actions is-flex">
        <button
          disabled={connecting}
          className="button is-outlined is-primary is-uppercase"
          onClick={exitSite}
        >
          {t('EXIT_SITE')}
        </button>

        {either(
          !isNil(serialNumber) && !isEmpty(serialNumber),
          <button
            disabled={connecting}
            className="button is-primary is-uppercase is-center is-small mt-20"
            onClick={reconnectToPVS}
          >
            {connecting ? t('CONNECTING') : t('RECONNECT')}
          </button>
        )}
      </div>

      <SwipeableBottomSheet
        shadowTip={false}
        open={manualInstructions}
        onChange={() => showManualInstructions(!manualInstructions)}
      >
        <div className="manual-instructions is-flex">
          <span className="has-text-weight-bold has-text-white mb-10">
            {t('MANUAL_CONNECT_INSTRUCTIONS_1')}
          </span>
          <span className="mb-10">{t('MANUAL_CONNECT_INSTRUCTIONS_2')}</span>
          <div className="mb-15 is-flex network-details">
            <span className="has-text-white">
              <b>{t('SSID')}</b>
              {SSID}
            </span>
            <span className="has-text-white">
              <b>{t('PASSWORD')}</b>
              {password}
            </span>
          </div>
          <div className="mt-10 mb-20">
            <button
              className="button is-primary"
              onClick={copyPasswordToClipboard}
            >
              {t('COPY_PWD_TO_CLIPBOARD')}
            </button>
          </div>
          <div className="mt-10 mb-20">
            <button
              className="button is-primary is-outlined"
              onClick={abortConnection}
            >
              {t('ABORT_CONNECTION')}
            </button>
          </div>
        </div>
      </SwipeableBottomSheet>
    </div>
  )
}

export default ConnectionLost
