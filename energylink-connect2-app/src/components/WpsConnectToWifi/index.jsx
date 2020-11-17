import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { path } from 'ramda'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import WpsLogo from './WpsLogo'
import { useI18n } from 'shared/i18n'
import useTimer from 'hooks/useTimer'
import {
  CONNECT_NETWORK_AP_INIT,
  SET_WPS_CONNECTION_STATUS
} from 'state/actions/systemConfiguration'

import './WpsConnectToWifi.scss'

const WpsConnectToWifi = ({ open, onChange }) => {
  const t = useI18n()
  const dispatch = useDispatch()

  const { wpsConnectionStatus } = useSelector(
    path(['systemConfiguration', 'network'])
  )
  const [, , startCountdown, resetCountdown, secondsCountdown] = useTimer(
    90,
    false
  )

  const idle = (
    <>
      <span className="has-text-weight-bold is-size-6">
        {t('PRESS_WPS_BUTTON')}
      </span>

      <div className="mt-20 has-text-centered">
        <WpsLogo />
      </div>

      <div className="mt-10 mb-20">
        <span>{t('WPS_DIRECTIONS')}</span>
      </div>

      <div className="mt-20 mb-20">
        <div className="inline-buttons">
          <button
            className="button is-primary is-uppercase is-outlined"
            onClick={() => onChange()}
          >
            {t('CANCEL')}
          </button>

          <button
            className="button is-primary is-uppercase"
            onClick={() => {
              startCountdown()
              dispatch(
                CONNECT_NETWORK_AP_INIT({
                  mode: 'wps-pbc'
                })
              )
            }}
          >
            {t('START')}
          </button>
        </div>
      </div>
    </>
  )

  const connecting = (
    <>
      <span className="has-text-weight-bold is-size-6">
        {t('CONNECTING_WIFI_NETWORK')}
      </span>

      <div className="mt-20 mb-20 is-size-4">
        <span>{secondsCountdown}</span>
      </div>

      <div className="mt-20 mb-20">
        <div className="inline-buttons">
          <button
            className="button is-primary is-uppercase is-outlined"
            onClick={() => {
              resetCountdown()
              dispatch(SET_WPS_CONNECTION_STATUS('idle'))
              onChange()
            }}
          >
            {t('CANCEL')}
          </button>

          <button className="button is-primary is-uppercase" disabled>
            {t('CONNECTING_WITHOUT_ELLIPSIS')}
          </button>
        </div>
      </div>
    </>
  )

  const success = (
    <>
      <span className="has-text-weight-bold is-size-6">
        {t('CONNECTION_SUCCESS')}
      </span>

      <div className="mt-20">
        <span className="is-size-2 sp-check has-text-white" />
      </div>

      <div className="mt-10 mb-20">
        <span>{t('WPS_CONNECTION_SUCCESS')}</span>
      </div>

      <div className="mt-20 mb-20">
        <button
          className="button is-primary is-uppercase"
          onClick={() => {
            resetCountdown()
            dispatch(SET_WPS_CONNECTION_STATUS('idle'))
            onChange()
          }}
        >
          {t('OK')}
        </button>
      </div>
    </>
  )

  const error = (
    <>
      <span className="has-text-weight-bold is-size-6">
        {t('WPS_CONNECTION_ERROR')}
      </span>

      <div className="mt-20 has-text-centered">
        <WpsLogo />
      </div>

      <div className="mt-10 mb-20">
        <span>{t('WPS_CONNECTION_RETRY')}</span>
      </div>

      <div className="mt-20 mb-20">
        <div className="inline-buttons">
          <button
            className="button is-primary is-uppercase is-outlined"
            onClick={() => {
              resetCountdown()
              dispatch(SET_WPS_CONNECTION_STATUS('idle'))
              onChange()
            }}
          >
            {t('CANCEL')}
          </button>

          <button
            className="button is-primary is-uppercase"
            onClick={() => {
              resetCountdown()
              startCountdown()
              dispatch(
                CONNECT_NETWORK_AP_INIT({
                  mode: 'wps-pbc'
                })
              )
            }}
          >
            {t('RETRY')}
          </button>
        </div>
      </div>
    </>
  )

  const modalContent = {
    idle,
    connecting,
    success,
    error
  }

  return (
    <SwipeableBottomSheet
      open={open}
      onChange={onChange}
      style={{ zIndex: '9999' }}
    >
      <div className="wps-connect-to-wifi has-text-centered">
        {modalContent[wpsConnectionStatus]}
      </div>
    </SwipeableBottomSheet>
  )
}

export default WpsConnectToWifi
