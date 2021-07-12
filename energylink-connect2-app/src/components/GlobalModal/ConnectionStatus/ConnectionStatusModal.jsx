import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import ConnectedGraphic from './ConnectedGraphic'
import ConnectingGraphic from './ConnectingGraphic'
import NotConnectedGraphic from './NotConnectedGraphic'

import { useGlobalHideModal } from 'hooks/useGlobalModal'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { RESET_DISCOVERY } from 'state/actions/devices'
import { RESET_LAST_VISITED_PAGE } from 'state/actions/global'
import { RESET_INVENTORY } from 'state/actions/inventory'
import {
  PVS_CONNECTION_INIT,
  RESET_PVS_CONNECTION,
  STOP_NETWORK_POLLING
} from 'state/actions/network'
import { RESET_PVS_INFO_STATE } from 'state/actions/pvs'
import { RESET_SITE } from 'state/actions/site'
import { appConnectionStatus } from 'state/reducers/network'

const ConnectionStatusModal = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const closeModal = useGlobalHideModal()
  const t = useI18n()

  const { connectionStatus, connecting, SSID: ssid, password } = useSelector(
    state => state.network
  )
  const { serialNumber } = useSelector(state => state.pvs)

  const exitSite = () => {
    closeModal()
    dispatch(STOP_NETWORK_POLLING())
    dispatch(RESET_PVS_INFO_STATE())
    dispatch(RESET_PVS_CONNECTION())
    dispatch(RESET_DISCOVERY())
    dispatch(RESET_INVENTORY())
    dispatch(RESET_SITE())
    dispatch(RESET_LAST_VISITED_PAGE())
    history.push(paths.PROTECTED.ROOT.path)
  }

  return connecting ? (
    <div className="has-text-centered is-flex flex-column">
      <div>
        <div className="mt-10 mb-20">
          <ConnectingGraphic />
        </div>
        <div className="has-text-white has-text-weight-bold">
          <span>{t('HOLD_ON')}</span>
        </div>
        <div className="has-text-white mb-10">
          <span>{t('CONNECTING_TO_PVS')}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="has-text-centered is-flex flex-column">
      {either(
        connectionStatus === appConnectionStatus.CONNECTED,
        <div>
          <div className="mt-10 mb-20">
            <ConnectedGraphic />
          </div>
          <div className="has-text-white has-text-weight-bold">
            <span>{t('CONNECTED_TO_PVS')}</span>
          </div>
          <div className="has-text-white mb-10">
            <span>{serialNumber}</span>
          </div>
          <div>
            <button
              onClick={closeModal}
              className="button is-primary is-outlined"
            >
              {t('CLOSE')}
            </button>
          </div>
        </div>
      )}
      {either(
        connectionStatus === appConnectionStatus.NOT_USING_WIFI,
        <div>
          <div className="mt-10 mb-20">
            <NotConnectedGraphic />
          </div>
          <div className="has-text-white has-text-weight-bold mb-10">
            <span>{t('NOT_USING_WIFI1')}</span>
          </div>
          <div className="has-text-white mb-10">
            <span>{t('NOT_USING_WIFI2')}</span>
          </div>
        </div>
      )}
      {either(
        connectionStatus === appConnectionStatus.NOT_CONNECTED_PVS,
        <div>
          <div className="mt-10 mb-20">
            <NotConnectedGraphic />
          </div>
          <div className="has-text-white has-text-weight-bold mb-10">
            <span>{t('RECONNECT_TO_PVS1')}</span>
          </div>
          <div className="has-text-white mb-10">
            <span>{t('RECONNECT_TO_PVS2')}</span>
          </div>
          <div className="inline-buttons">
            <button
              onClick={exitSite}
              className="button is-primary is-outlined"
            >
              {t('EXIT_SITE')}
            </button>
            <button
              onClick={() => dispatch(PVS_CONNECTION_INIT({ ssid, password }))}
              className="button is-primary"
            >
              {t('RECONNECT')}
            </button>
          </div>
        </div>
      )}
      {either(
        connectionStatus === appConnectionStatus.NOT_CONNECTED,
        <div>
          <div className="mt-10 mb-20 has-text-white">
            <span className="sp-pvs is-size-1 pulse" />
          </div>
          <div className="has-text-white has-text-weight-bold mb-10">
            <span>{t('NOT_CONNECTED')}</span>
          </div>
          <div>
            <button onClick={closeModal} className="button is-primary">
              {t('CLOSE')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectionStatusModal
