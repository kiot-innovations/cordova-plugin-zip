import React from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import ModalLayout from '../../components/ModalLayout'
import SocialFooter from '../../components/SocialFooter'
import BlockGrid from '../../components/BlockGrid'
import BlockItem from '../../components/BlockItem'
import SunPowerImage from '../../components/SunPowerImage'
import paths from '../Router/paths'
import { useI18n } from '../../shared/i18n'
import { WifiIcon, BatteryIcon } from './Icons'

import './Settings.scss'

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

function Settings({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('menu-modal', className)
  const wifiStateEnum = useSelector(
    state =>
      state.wifi &&
      state.wifi.collectorStatus &&
      state.wifi.collectorStatus.WifiStatRptCtnt &&
      state.wifi.collectorStatus.WifiStatRptCtnt.wifiStatEnum
  )
  const wifi = wifiState[wifiStateEnum] || wifiState.CHECKING
  return (
    <ModalLayout
      className={classes}
      history={history}
      imageHeader={<SunPowerImage inverse />}
      from={location && location.state && location.state.from}
      hasBackButton
    >
      <BlockGrid location={location}>
        <BlockItem
          className="full-width-title"
          title={t('WIFI_SETTINGS')}
          to={paths.MENU_WIFI_SETTINGS}
          icon={<WifiIcon />}
          label={t(wifi.text)}
          labelState={wifi.state}
        />
        <BlockItem
          title={t('BATTERY_SETTINGS')}
          to={paths.MENU_BATTERY_SETTINGS}
          icon={<BatteryIcon />}
        />
      </BlockGrid>

      <div className="mt-50 mb-20 pl-10 pr-10">
        <SocialFooter />
      </div>
    </ModalLayout>
  )
}

export default Settings
