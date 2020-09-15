import React from 'react'
import { useHistory } from 'react-router-dom'
import paths from 'routes/paths'
import './DebugPage.scss'

const renderDebugLink = (history, name, path) => (
  <div className="debug-route mb-10" onClick={() => history.push(path)}>
    <div className="route-name">
      <span>{name}</span>
    </div>
    <div className="arrow-right pt-2">
      <span className="sp-chevron-right has-text-primary" />
    </div>
  </div>
)

const DebugPage = () => {
  const history = useHistory()

  return (
    <div className="pr-10 pl-10">
      <div className="has-text-centered mb-25">
        <span className="has-text-weight-bold is-uppercase"> Debug Page </span>
      </div>
      <div>
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
      </div>
    </div>
  )
}

export default DebugPage
