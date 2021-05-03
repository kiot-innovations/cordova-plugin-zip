import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filter, includes, isEmpty, length, pluck, prop, propEq } from 'ramda'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'
import Collapsible from 'components/Collapsible'
import paths from 'routes/paths'

import { PLT_LOAD } from 'state/actions/panel-layout-tool'

import './panelLayoutWidget.scss'

const PLI = <span className="sp-center file level mr-15 is-size-4" />

const PanelLayoutWidget = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()

  const { found } = useSelector(prop('devices'))
  const localInverters = filter(propEq('DEVICE_TYPE', 'Inverter'), found)
  const localSerialNumbers = pluck('SERIAL', localInverters)

  const { loading, panels, lastModifiedDate } = useSelector(prop('pltWizard'))
  const cloudSerialNumbers = pluck('id', panels)

  const placedModules = localSerialNumbers.filter(localSerialNumber =>
    includes(localSerialNumber, cloudSerialNumbers)
  )

  const placedModulesCount = length(placedModules)
  const expectedModulesCount = length(localSerialNumbers)

  const hasPanelLayoutData = !isEmpty(panels)

  return (
    <Collapsible
      title={t('PANEL_LAYOUT')}
      className="panel-layout-widget"
      icon={PLI}
    >
      {either(
        loading,
        <div className="has-text-centered width-100">
          <div>
            <Loader />
          </div>
          <div>
            <span className="has-text-white">
              {t('RETRIEVING_LAYOUT_DATA')}
            </span>
          </div>
        </div>,
        <>
          {either(
            hasPanelLayoutData,
            <div>
              {either(
                lastModifiedDate,
                <div className="mb-10 is-fullwidth">
                  <span className="is-block has-text-weight-bold has-text-white">
                    {t('LAST_TIME_UPDATED')}:{' '}
                  </span>
                  <span className="is-block has-text-weight-bold has-text-white">
                    {moment(lastModifiedDate).format('LLL')}
                  </span>{' '}
                  <span className="has-text-weight-bold">
                    ({moment(lastModifiedDate).fromNow()})
                  </span>
                </div>
              )}
              <div className="is-flex align-baseline">
                <div>
                  <span className="is-size-3 has-text-weight-bold">
                    {`${placedModulesCount}/${expectedModulesCount}`}
                  </span>
                </div>
                <div className="ml-5">
                  <span>{t('PLT_MODULES_PLACED')}</span>
                </div>
              </div>
            </div>,
            <>
              <span className="has-text-white has-text-weight-bold">
                {t('NO_PANEL_DATA')}
              </span>
            </>
          )}
          <div className="is-flex width-100">
            <button
              className="button is-primary is-outlined is-fullwidth mr-10 is-uppercase"
              onClick={() => dispatch(PLT_LOAD())}
            >
              {t('REFRESH_LAYOUT')}
            </button>
            <button
              onClick={() =>
                history.push(paths.PROTECTED.PANEL_LAYOUT_TOOL.path)
              }
              className="button is-primary is-fullwidth ml-10 is-uppercase"
            >
              {t('PLT_LINK')}
            </button>
          </div>
        </>
      )}
    </Collapsible>
  )
}

export default PanelLayoutWidget
