import React, { useEffect, useRef, useState } from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { pathOr } from 'ramda'
import paths from 'routes/paths'
import { POST_COMPONENT_MAPPING } from 'state/actions/storage'
import SwipeableSheet from 'hocs/SwipeableSheet'

import './ESSDeviceMapping.scss'

function DeviceMapping({ history }) {
  const t = useI18n()
  const historyRouter = useHistory()
  const dispatch = useDispatch()
  const unblockHandle = useRef()
  const [modal, showModal] = useState(false)

  const { componentMapping, error } = useSelector(pathOr({}, ['storage']))
  const status = useSelector(
    pathOr('', ['storage', 'componentMapping', 'component_mapping_status'])
  )

  useEffect(() => {
    if (status !== 'RUNNING') dispatch(POST_COMPONENT_MAPPING())
  }, [dispatch, status])

  useEffect(() => {
    if (error === 'COMPONENT_MAPPING_ERROR') {
      historyRouter.push(paths.PROTECTED.ESS_DEVICE_MAPPING_ERROR.path)
    }
  }, [error, historyRouter])

  useEffect(() => {
    if (status === 'SUCCEEDED') {
      historyRouter.push(paths.PROTECTED.ESS_DEVICE_MAPPING_SUCCESS.path)
    }
  }, [componentMapping, historyRouter, status])

  useEffect(() => {
    unblockHandle.current = history.block(() => {
      if (status !== 'RUNNING') {
        showModal(true)
        return false
      }
    })
    return function() {
      unblockHandle.current && unblockHandle.current()
    }
  })

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

      <SwipeableSheet open={modal} onChange={() => showModal(!modal)}>
        <div className="update-in-progress is-flex">
          <span className="has-text-weight-bold">{t('HOLD_ON')}</span>
          <span className="mt-10 mb-10">{t('WAIT_FOR_DM')}</span>
          <div className="mt-10 mb-20">
            <button
              className="button is-primary"
              onClick={() => showModal(false)}
            >
              {t('CLOSE')}
            </button>
          </div>
        </div>
      </SwipeableSheet>
    </section>
  )
}

export default DeviceMapping
