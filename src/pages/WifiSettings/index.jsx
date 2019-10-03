import React, { useEffect } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useField } from 'react-final-form-hooks'
import ModalLayout from '../../components/ModalLayout'
import ModalItem from '../../components/ModalItem'
import ScrollableGrid from '../../components/ScrollableGrid'
import ScrollableGridItem from '../../components/ScrollableGridItem'
import WifiSignalIcon from '../../components/WifiSignalIcon'
import PasswordToggle from '../../components/PasswordToggle'
import TextField from '../../components/TextField'
import paths from '../Router/paths'
import { useI18n } from '../../shared/i18n'
import { getWifiNetworks } from '../../state/actions/wifi'
import { WifiIcon } from '../Settings/Icons'
import { ActiveIcon, InfoIcon } from './Icons'

import './WifiSettings.scss'

const wifiState = {
  CONNECTED: {
    text: 'CONNECTED',
    state: 'success'
  },
  UNCONFIGURED: {
    text: 'NOT_CONNECTED',
    state: 'error'
  },
  CHECKING: {
    text: 'CHECKING_CONNECTION',
    state: 'warn'
  }
}

function onSubmit(dispatch) {
  return async values => {}
}

function validate(values, t) {
  const errors = {}

  return errors
}

function selectNetwork(network, form) {
  return () => form.change('networkName', network.ssid)
}

function scanNetworks(dispatch, serialNumber) {
  return () => dispatch(getWifiNetworks(serialNumber, true))
}

function WifiSettings({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('wifi-settings-modal', className)
  const dispatch = useDispatch()
  const { collectorStatus, networks, hasScanError } = useSelector(
    state => state.wifi
  )
  const { form, handleSubmit, submitting } = useForm({
    onSubmit: onSubmit(dispatch),
    validate: values => validate(values, t)
  })

  const networkName = useField('networkName', form)
  const password = useField('password', form)
  const currentNetwork = collectorStatus.WifiStatRptCtnt
  const wifiStateEnum = currentNetwork ? currentNetwork.wifiStatEnum : ''
  const currentNetworkName = currentNetwork ? currentNetwork.ssid : ''

  const wifi = wifiState[wifiStateEnum] || wifiState.CHECKING
  const serialNumber = collectorStatus.SN

  useEffect(() => {
    dispatch(getWifiNetworks())
  }, [dispatch])

  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('WIFI_SETTINGS')}
      from={location && location.state && location.state.from}
      hasBackButton
    >
      <ModalItem className="fit-screen pt-0" paddingLeft="" paddingRight="">
        <div className="wifi-status-container pr-30 pl-30 is-flex">
          <div className="icon-container is-flex">
            <WifiIcon height="27" width="35" />
          </div>
          <div className="wifi-status pr-20 pl-20 is-flex">
            <h2>{t('WIFI_STATUS')}</h2>
            <span className={wifi.state}>{t(wifi.text)}</span>
          </div>
          <div className="icon-container is-flex">
            <Link
              to={{
                pathname: paths.MENU_ABOUT_WIFI,
                state: {
                  from: location && location.state && location.state.from
                }
              }}
            >
              <InfoIcon className="info-btn" />
            </Link>
          </div>
        </div>
        <div className="wifi-networks-selector pr-10 pl-10 is-flex">
          <div className="wifi-networks-container mt-30 is-flex">
            <div className="network-header mb-10 is-flex">
              <h3 className="title is-6">{t('NETWORKS')}</h3>
              <span
                className="btn-scan"
                onClick={scanNetworks(dispatch, serialNumber)}
              >
                {t('SCAN')}
              </span>
            </div>
            <div className="network-grid">
              <ScrollableGrid>
                {networks.length ? (
                  networks.map(n => (
                    <ScrollableGridItem
                      key={n.bssid}
                      text={n.ssid}
                      leftIcon={currentNetworkName === n.ssid && <ActiveIcon />}
                      rightIcon={
                        <WifiSignalIcon signalQuality={n.signalQuality} />
                      }
                      onClick={selectNetwork(n, form)}
                      paddingLeft={
                        currentNetworkName === n.ssid ? 'pl-10' : 'pl-30'
                      }
                    />
                  ))
                ) : (
                  <ScrollableGridItem
                    key="0"
                    text={t(hasScanError ? 'SCANNING_ERROR' : 'SCANNING')}
                  />
                )}
              </ScrollableGrid>
            </div>
          </div>
          <div className="wifi-networks-form mt-10 pr-10 pl-10 is-flex">
            <form className="control" onSubmit={handleSubmit}>
              <div className="column">
                <TextField
                  input={networkName.input}
                  meta={networkName.meta}
                  className="input-light"
                  placeholder={t('PLACEHOLDER_NETWORK_NAME')}
                  disabled
                />
                <PasswordToggle
                  input={password.input}
                  meta={password.meta}
                  placeholder={t('PLACEHOLDER_PASSWORD')}
                  className="input-light"
                />
              </div>
              <div className="column">
                <div className="field is-grouped is-grouped-centered">
                  <p className="control">
                    <button
                      className="button is-uppercase is-primary"
                      type="submit"
                      disabled={submitting}
                    >
                      {t('CONNECT')}
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ModalItem>
    </ModalLayout>
  )
}

export default WifiSettings
