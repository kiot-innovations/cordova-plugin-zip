import { pathOr, isEmpty, isNil, path } from 'ramda'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import InterfacesWidget from 'pages/SystemConfiguration/InterfacesWidget'
import NetworkWidget from 'pages/SystemConfiguration/NetworkWidget'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import {
  START_COMMISSIONING_INIT,
  START_DISCOVERY_INIT
} from 'state/actions/pvs'
import { discoveryTypes } from 'state/reducers/devices'
import { rmaModes } from 'state/reducers/rma'

import './PVSProvideInternet.scss'

const PVSProvideInternet = () => {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()

  const { rmaMode } = useSelector(state => state.rma)
  const { wpsSupport } = useSelector(state => state.pvs)
  const { isConnecting } = useSelector(path(['systemConfiguration', 'network']))

  const versionChecked = useSelector(
    pathOr(false, ['firmwareUpdate', 'canContinue'])
  )

  const { isOnline } = useSelector(pathOr(false, ['network']))
  const { isFetching } = useSelector(
    pathOr(false, ['systemConfiguration', 'interfaces'])
  )

  const shouldConnect =
    !isOnline || isEmpty(isOnline) || isNil(isOnline) || isConnecting

  useEffect(() => {
    if (versionChecked) {
      dispatch(START_COMMISSIONING_INIT())
      if (rmaMode === rmaModes.NONE) {
        dispatch(
          START_DISCOVERY_INIT({
            Device: 'allnomi',
            Interfaces: ['mime'],
            type: discoveryTypes.ALLNOMI
          })
        )
      }
    }
  }, [dispatch, versionChecked, rmaMode])

  return (
    <div className="pvs-provide-internet full-height pr-20 pl-20">
      <p className="is-uppercase has-text-centered has-text-weight-bold align-start">
        {t('CONFIGURE_NETWORK')}
      </p>

      <div className="mb-10 mt-20">
        <InterfacesWidget />
      </div>
      <div className="align-start mt-10">
        <NetworkWidget
          expanded={shouldConnect && !isFetching}
          hideWPSButton={!wpsSupport}
        />
      </div>

      {either(
        shouldConnect,
        <div className="has-text-white is-size-6 is-bold is-text has-text-centered">
          {t(isFetching ? 'PVS_CHECKING_INTERNET' : 'PVS_PROVIDE_INTERNET')}
        </div>,
        <div />
      )}

      <div className="container is-flex pt-20">
        <button
          onClick={() =>
            history.push(paths.PROTECTED.PRECOMMISSIONING_CONFIGS.path)
          }
          className="button is-uppercase is-center auto continue-button is-primary"
          disabled={shouldConnect}
        >
          {t('CONTINUE')}
        </button>
      </div>
    </div>
  )
}

export default PVSProvideInternet
