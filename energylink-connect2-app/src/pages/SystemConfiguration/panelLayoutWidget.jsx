import React from 'react'
import { useSelector } from 'react-redux'
import { compose, filter, length, path, prop, propEq } from 'ramda'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'
import Collapsible from 'components/Collapsible'
import paths from 'routes/paths'

import './panelLayoutWidget.scss'

const getInvertersCount = compose(
  length,
  filter(propEq('DEVICE_TYPE', 'Inverter'))
)

const PanelLayoutWidget = () => {
  const t = useI18n()
  const history = useHistory()

  const { loading, panels, lastModifiedDate } = useSelector(prop('pltWizard'))
  const devicesFound = useSelector(path(['devices', 'found']))
  const invertersMissing = getInvertersCount(devicesFound)

  const hasPanelLayoutData = panels.length !== 0

  return (
    <Collapsible title={t('PANEL_LAYOUT')} className="panel-layout-widget">
      {either(
        loading,
        <Loader />,
        <>
          {either(
            hasPanelLayoutData,
            <div>
              {either(
                lastModifiedDate,
                <>
                  <span className="is-block has-text-weight-bold has-text-white">
                    {t('LAST_TIME_UPDATED')}:{' '}
                  </span>
                  <span className="is-block has-text-weight-bold has-text-white">
                    {moment(lastModifiedDate).format('LLL')}
                  </span>{' '}
                  <span className="has-text-weight-bold">
                    ({moment(lastModifiedDate).fromNow()})
                  </span>
                </>
              )}
            </div>,
            <>
              <span className="has-text-white has-text-weight-bold">
                {t('NO_PANEL_DATA')}
              </span>
            </>
          )}
          <div>
            <span className="is-size-3 has-text-weight-bold">
              {`${invertersMissing} `}
            </span>
            {either(
              hasPanelLayoutData,
              <span>
                {t('MODULES_PRESENT', panels.length !== 1 ? 's' : '')}
              </span>,
              <span>
                {t('MODULES_NO_PRESENT', invertersMissing !== 1 ? 's' : '')}
              </span>
            )}
          </div>
          <button
            onClick={() => history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)}
            className="button is-secondary mb-10 center-button"
          >
            {t('PLT_LINK')}
          </button>
        </>
      )}
    </Collapsible>
  )
}

export default PanelLayoutWidget
