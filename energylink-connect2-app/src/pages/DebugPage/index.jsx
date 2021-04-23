import Collapsible from 'components/Collapsible'
import {
  DOWNLOAD_ESS_FIRMWARE_LIST,
  SHOW_SUPERUSER_SETTINGS,
  HIDE_SUPERUSER_SETTINGS
} from 'state/actions/superuser'
import React, { useState, useEffect } from 'react'
import { map } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import './DebugPage.scss'
import {
  SET_ESS_UPDATE_OVERRIDE,
  SET_PVS_UPDATE_OVERRIDE,
  DEFAULT_ALL_UPDATE_OVERRIDES
} from 'state/actions/fileDownloader'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'
import { useI18n } from 'shared/i18n'
import SelectField from 'components/SelectField'
import { either } from 'shared/utils'

const renderDebugLink = (history, name, path) => (
  <div className="debug-route mb-10" onClick={() => history.push(path)}>
    <div className="route-name">
      <span>{name}</span>
    </div>
  </div>
)

const DebugPage = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const { essUpdateOverride, pvsUpdateOverride } = useSelector(
    state => state.fileDownloader.settings
  )
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
    dispatch(DOWNLOAD_ESS_FIRMWARE_LIST())
  }, [dispatch])

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
          {renderDebugLink(history, 'Live Data', paths.PROTECTED.DATA.path)}
          {renderDebugLink(
            history,
            'Precommissioning Configs',
            paths.PROTECTED.PRECOMMISSIONING_CONFIGS.path
          )}
          {renderDebugLink(
            history,
            'Scan Labels (Scandit)',
            paths.PROTECTED.SCAN_LABELS.path
          )}
          {renderDebugLink(
            history,
            'SunVault PreDiscovery',
            paths.PROTECTED.STORAGE_PREDISCOVERY.path
          )}
          {renderDebugLink(
            history,
            'SunVault Connected Device Update',
            paths.PROTECTED.EQS_UPDATE.path
          )}
          {renderDebugLink(
            history,
            'SunVault Device Mapping',
            paths.PROTECTED.ESS_DEVICE_MAPPING.path
          )}
          {renderDebugLink(
            history,
            'SunVault Health Check',
            paths.PROTECTED.ESS_HEALTH_CHECK.path
          )}
          {renderDebugLink(
            history,
            'Connection Recovery Page',
            paths.PROTECTED.CONNECTION_LOST.path
          )}
          {renderDebugLink(
            history,
            'RMA - Existing Devices for PVS Replacement',
            paths.PROTECTED.RMA_EXISTING_DEVICES.path
          )}
          {renderDebugLink(
            history,
            'RMA - New Inventory Count',
            paths.PROTECTED.RMA_INVENTORY.path
          )}
          {renderDebugLink(
            history,
            'RMA - New and existing Microinverters',
            paths.PROTECTED.RMA_SN_LIST.path
          )}
          {renderDebugLink(
            history,
            'RMA - Edit Devices',
            paths.PROTECTED.RMA_DEVICES.path
          )}
          {renderDebugLink(
            history,
            'Standard Serial Number List',
            paths.PROTECTED.SN_LIST.path
          )}
          {renderDebugLink(
            history,
            'Connect PVS to Internet',
            paths.PROTECTED.PVS_PROVIDE_INTERNET.path
          )}
          {renderDebugLink(
            history,
            'Precommissioning Checklist',
            paths.PROTECTED.PRECOMM_CHECKLIST.path
          )}
          {renderDebugLink(
            history,
            'POC for BLE Connection',
            paths.PROTECTED.NEARBY_PVS.path
          )}
        </Collapsible>
      </div>
    </div>
  )
}

export default DebugPage
