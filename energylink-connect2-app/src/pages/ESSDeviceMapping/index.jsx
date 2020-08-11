import React, { useEffect } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { pathOr } from 'ramda'
import paths from 'routes/paths'
import { POST_COMPONENT_MAPPING } from 'state/actions/storage'
import './ESSDeviceMapping.scss'

function DeviceMapping() {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const progressStatus = ['RUNNING', 'NOT_RUNNING']
  const { componentMapping, error } = useSelector(pathOr({}, ['storage']))
  const status = useSelector(
    pathOr('', ['storage', 'componentMapping', 'component_mapping_status'])
  )

  useEffect(() => {
    dispatch(POST_COMPONENT_MAPPING())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (error === 'COMPONENT_MAPPING_ERROR') {
      history.push(paths.PROTECTED.ESS_DEVICE_MAPPING_ERROR.path)
    }
  }, [error, history])

  useEffect(() => {
    if (status === 'SUCCEEDED') {
      history.push(paths.PROTECTED.ESS_DEVICE_MAPPING_SUCCESS.path)
    }
  }, [componentMapping, history, progressStatus, status])

  return (
    <section className="ess-device-mapping is-flex tile is-vertical has-text-weight-bold pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">
        {t('DEVICE_MAPPING')}
      </h1>

      <div className="main-container">
        <div className="pt-20 pb-20">
          <div className="inline-loader">
            <div className="ball-scale-ripple">
              <div />
            </div>
          </div>
        </div>
        <div>{t('DEVICE_MAPPING_IN_PROGRESS')}</div>
      </div>
    </section>
  )
}

export default DeviceMapping
