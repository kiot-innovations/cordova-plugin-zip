import { map } from 'ramda'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'
import Toggler from 'components/Toggler'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'
import {
  SET_ESS_UPDATE_OVERRIDE,
  SET_PVS_UPDATE_OVERRIDE,
  SET_DO_NOT_UPDATE_PVS,
  DEFAULT_ALL_UPDATE_OVERRIDES
} from 'state/actions/fileDownloader'
import {
  DOWNLOAD_SUPERUSER_FIRMWARE_LIST,
  SHOW_SUPERUSER_SETTINGS,
  HIDE_SUPERUSER_SETTINGS
} from 'state/actions/superuser'
import { MENU_HIDE } from 'state/actions/ui'

import './DebugPage.scss'

const debugPages = {
  'PCS (PCS)': paths.PROTECTED.PCS.path,
  SystemChecks: paths.PROTECTED.SYSTEM_CHECKS.path,
  'Saving Configuration': paths.PROTECTED.SAVING_CONFIGURATION.path,
  'Live Data': paths.PROTECTED.DATA.path,
  'Other Devices': paths.PROTECTED.ADD_STRING_INVERTERS.path,
  'String Inverters Setup': paths.PROTECTED.CONFIGURE_STRING_INVERTER.path,
  'Precommissioning Configs': paths.PROTECTED.PRECOMMISSIONING_CONFIGS.path,
  'Scan Labels (Scandit)': paths.PROTECTED.SCAN_LABELS.path,
  'SunVault PreDiscovery': paths.PROTECTED.STORAGE_PREDISCOVERY.path,
  'SunVault Connected Device Update': paths.PROTECTED.EQS_UPDATE.path,
  'SunVault Device Mapping': paths.PROTECTED.ESS_DEVICE_MAPPING.path,
  'SunVault Health Check': paths.PROTECTED.ESS_HEALTH_CHECK.path,
  'Connection Recovery Page': paths.PROTECTED.CONNECTION_LOST.path,
  'RMA - Existing Devices for PVS Replacement':
    paths.PROTECTED.RMA_EXISTING_DEVICES.path,
  'RMA - New Inventory Count': paths.PROTECTED.RMA_INVENTORY.path,
  'RMA - New and existing Microinverters': paths.PROTECTED.RMA_SN_LIST.path,
  'RMA - Edit Devices': paths.PROTECTED.RMA_DEVICES.path,
  'Standard Serial Number List': paths.PROTECTED.SN_LIST.path,
  'Connect PVS to Internet': paths.PROTECTED.PVS_PROVIDE_INTERNET.path,
  'Precommissioning Checklist': paths.PROTECTED.PRECOMM_CHECKLIST.path,
  'POC for BLE Connection': paths.PROTECTED.NEARBY_PVS.path,
  'Precommissioning Configurations':
    paths.PROTECTED.PRECOMMISSIONING_CONFIGS.path,
  'Microinverters Discovery': paths.PROTECTED.DEVICES.path,
  'System Configuration': paths.PROTECTED.SYSTEM_CONFIGURATION.path
}

const renderDebugLink = (name, path, onDebugLinkClicked) => (
  <div
    className="debug-route is-flex mb-10"
    onClick={() => onDebugLinkClicked(path)}
  >
    <div className="route-name">
      <span>{name}</span>
    </div>
    <div className="arrow-right pt-2">
      <span className="sp-chevron-right has-text-primary" />
    </div>
  </div>
)

const buildPageMappingFn = (debugPagesList, onDebugLinkClicked) => pageName =>
  renderDebugLink(pageName, debugPagesList[pageName], onDebugLinkClicked)

const DebugPage = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    essUpdateOverride,
    pvsUpdateOverride,
    doNotUpdatePVS
    // doNotUpdateESS
  } = useSelector(state => state.fileDownloader.settings)

  const [selectedESSUpdate, setSelectedESSUpdate] = useState(essUpdateOverride)
  const [selectedPVSUpdate, setSelectedPVSUpdate] = useState(pvsUpdateOverride)
  const [showThisMightNotWork, setShowThisMightNotWork] = useState(false)

  let { essUpdateList, pvsUpdateList } = useSelector(state => state.superuser)

  const useDefaults = () => {
    dispatch(DEFAULT_ALL_UPDATE_OVERRIDES())
    dispatch(DOWNLOAD_OS_INIT())
    dispatch(HIDE_SUPERUSER_SETTINGS())
    //reset the options here
    setSelectedESSUpdate({
      displayName: '',
      url: ''
    })
    setSelectedPVSUpdate({
      displayName: '',
      url: ''
    })
  }

  const setUpdateOverrides = () => {
    dispatch(SET_ESS_UPDATE_OVERRIDE(selectedESSUpdate))
    dispatch(SET_PVS_UPDATE_OVERRIDE(selectedPVSUpdate))
    dispatch(SHOW_SUPERUSER_SETTINGS())
    //this triggers the storage fw download
    dispatch(DOWNLOAD_OS_INIT())
  }

  useEffect(() => {
    dispatch(DOWNLOAD_SUPERUSER_FIRMWARE_LIST())
  }, [dispatch])

  const onDebugLinkClicked = path => {
    history.push(path)
    dispatch(MENU_HIDE())
  }

  const getPVSDisplayName = pvsURL => {
    const urlSplit = pvsURL.split('/')
    const releaseName = urlSplit[3]
    const releaseNumber = urlSplit[4]
    return `${releaseName} (${releaseNumber})`
  }

  const pvsUpdateChangeHandler = e => {
    const pvsUpdate = {
      displayName: e.label,
      url: e.value
    }
    setSelectedPVSUpdate(pvsUpdate)
    setShowThisMightNotWork(true)
  }

  const essUpdateChangeHandler = e => {
    const essUpdate = {
      displayName: e.label,
      url: e.value
    }
    setSelectedESSUpdate(essUpdate)

    const pvsUpdate = {
      displayName: getPVSDisplayName(e.pvs),
      url: e.pvs
    }
    setSelectedPVSUpdate(pvsUpdate)
    setShowThisMightNotWork(false)
  }

  const buildPVSUpdateListSelectValue = value => {
    return {
      label: value.displayName,
      value: value.url
    }
  }

  const buildESSUpdateListSelectValue = value => {
    return {
      label: value.displayName,
      value: value.ess,
      pvs: value.pvs
    }
  }

  return (
    <div className="pr-10 pl-10 debug-page">
      <div className="has-text-centered mb-25">
        <span className="has-text-weight-bold title">
          {t('SUPERUSER_OPTIONS')}
        </span>
      </div>
      <div className="mb-10">
        <Collapsible title="Firmware Version" expanded={true}>
          {either(
            pvsUpdateOverride.url || essUpdateOverride.url,
            <span className="use-defaults" onClick={useDefaults}>
              Use Defaults
            </span>
          )}

          <b className="option-title">
            {t('SUPERUSER_OPTIONS_PLATFORM_FIRMWARE_TITLE')}
          </b>
          <p>
            {t('SUPERUSER_OPTIONS_CONNECTED_DEVICES_FIRMWARE_CURRENT')}{' '}
            {pvsUpdateOverride.url ? pvsUpdateOverride.displayName : 'Default'}
          </p>
          <SelectField
            value={
              selectedPVSUpdate.url
                ? {
                    label: selectedPVSUpdate.displayName,
                    value: selectedPVSUpdate.url
                  }
                : null
            }
            isSearchable={true}
            options={map(buildPVSUpdateListSelectValue, pvsUpdateList)}
            onSelect={pvsUpdateChangeHandler}
            className="mt-10 mb-10"
          />
          <br />
          <div className="pr-15">
            <Toggler
              text={t('SUPERUSER_DO_NOT_PUSH')}
              checked={doNotUpdatePVS}
              onChange={setting => {
                dispatch(SET_DO_NOT_UPDATE_PVS(setting))
                dispatch(SHOW_SUPERUSER_SETTINGS())
              }}
            />
          </div>
          <hr className="mb-10" />
          <b className="option-title">
            {t('SUPERUSER_OPTIONS_CONNECTED_DEVICES_FIRMWARE_TITLE')}
          </b>
          <p></p>
          <p>
            {t('SUPERUSER_OPTIONS_CONNECTED_DEVICES_FIRMWARE_CURRENT')}{' '}
            {essUpdateOverride.url ? essUpdateOverride.displayName : 'Default'}
          </p>

          <SelectField
            isSearchable={true}
            options={map(buildESSUpdateListSelectValue, essUpdateList)}
            onSelect={essUpdateChangeHandler}
            className="mt-10 mb-10"
          />
          <br />
          <div className="mt-10 mb-10 is-uppercase this-might-not-work error">
            {either(
              showThisMightNotWork,
              t('SUPERUSER_OPTIONS_THIS_MIGHT_NOT_WORK'),
              '\u00a0'
            )}
          </div>

          <div className="mt-10">
            <button
              onClick={setUpdateOverrides}
              className="button is-uppercase is-fullwidth download-custom-firmwares-button"
              disabled={!selectedESSUpdate.url && !selectedPVSUpdate.url}
            >
              {t('SUPERUSER_OPTIONS_DOWNLOAD_CUSTOM_FIRMWARES')}
            </button>
          </div>
        </Collapsible>
      </div>
      <div>
        <Collapsible title="Debug Routes" expanded={true}>
          {map(
            buildPageMappingFn(debugPages, onDebugLinkClicked),
            Object.keys(debugPages)
          )}
        </Collapsible>
      </div>
    </div>
  )
}

export default DebugPage
