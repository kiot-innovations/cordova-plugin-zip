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
          'EQS Device Mapping',
          paths.PROTECTED.ESS_DEVICE_MAPPING.path
        )}
        {renderDebugLink(
          history,
          'EQS Connected Device Update',
          paths.PROTECTED.EQS_UPDATE.path
        )}
        {renderDebugLink(
          history,
          'EQS Health Check',
          paths.PROTECTED.ESS_HEALTH_CHECK.path
        )}
      </div>
    </div>
  )
}

export default DebugPage
