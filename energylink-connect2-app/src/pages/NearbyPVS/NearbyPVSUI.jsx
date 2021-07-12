import { isEmpty, map } from 'ramda'
import React from 'react'

import { Loader } from 'components/Loader'
import SwipeableSheet from 'hocs/SwipeableSheet'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import './NearbyPVS.scss'

function NearbyPVSUI({
  bleSearching = false,
  retrySearch,
  devices = [],
  connectToPVS,
  connecting = false,
  dismissModal,
  connected = false,
  continueCommissioning
}) {
  const t = useI18n()

  const renderDevice = device => (
    <div
      className="ble-device mb-10"
      onClick={() => connectToPVS(device)}
      key={device.id}
    >
      <span className="mr-10 is-size-2 sp-pvs" />
      <span className="has-text-white has-text-weight-bold">{device.name}</span>
    </div>
  )

  const searchInProgress = (
    <div>
      <Loader />
      <span className="has-text-white">{t('BLE_SEARCHING')}</span>
    </div>
  )

  const retryFooter = (
    <div className="nearby-devices-footer pt-10 pb-10">
      <div>
        <span>{t('CANT_SEE_PVS')}</span>
      </div>
      <div className="has-text-white mt-10">
        <span>{t('PLEASE_REBOOT')}</span>
      </div>
      <div className="mt-10">
        <button className="button is-primary" onClick={retrySearch}>
          <span>{t('SEARCH_AGAIN')}</span>
        </button>
      </div>
    </div>
  )

  const noNearbyPVS = (
    <div className="has-text-centered no-nearby-pvs">
      <div className="mt-10 mb-20">
        <span className="has-text-white sp-hey is-size-1" />
      </div>
      <div className="mb-10">
        <span>{t('NO_PVS_NEARBY')}</span>
      </div>
      <div className="mb-10">
        <span>{t('NO_PVS_NEARBY_HINT')}</span>
      </div>
    </div>
  )

  const connectingModalContent = (
    <>
      <span className="has-text-weight-bold has-text-white">
        {t('HOLD_ON')}
      </span>
      <span className="has-text-white mt-10 mb-10">
        {t('CONNECTING_TO_PVS')}
      </span>
      <Loader />
      <span className="has-text-weight-bold mt-10">
        {t('PLEASE_STAY_CLOSE')}
      </span>
    </>
  )

  const connectedModalContent = (
    <>
      <span className="has-text-weight-bold has-text-white">
        {t('CONNECTION_SUCCESS')}
      </span>
      <div className="mt-10 mb-10">
        <span className="sp-check is-size-1 has-text-white" />
      </div>
      <span className="has-text-weight-bold mt-10 mb-10">
        {t('PLEASE_STAY_CLOSE_CONNECTED')}
      </span>
      <div className="has-text-centered">
        <button className="button is-primary" onClick={continueCommissioning}>
          {t('CONTINUE')}
        </button>
      </div>
    </>
  )
  return (
    <main className="full-height pl-10 pr-10 nearby-devices">
      <div className="nearby-devices-header has-text-centered">
        <span className="is-uppercase has-text-weight-bold">
          {t('SELECT_PVS')}
        </span>
      </div>
      <div className="nearby-devices-content has-text-centered">
        {either(bleSearching, searchInProgress)}
        {either(
          !bleSearching && isEmpty(devices),
          noNearbyPVS,
          map(renderDevice, devices)
        )}
      </div>
      {either(!bleSearching, retryFooter)}

      <SwipeableSheet onChange={dismissModal} open={connecting || connected}>
        <div className="nearby-devices-connecting is-flex pb-20">
          {either(connecting, connectingModalContent)}
          {either(connected, connectedModalContent)}
        </div>
      </SwipeableSheet>
    </main>
  )
}

export default NearbyPVSUI
