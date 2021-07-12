import { pathOr, isEmpty, isNil } from 'ramda'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { RESET_DISCOVERY } from 'state/actions/devices'
import { RESET_LAST_VISITED_PAGE } from 'state/actions/global'
import { RESET_INVENTORY } from 'state/actions/inventory'
import {
  RESET_PVS_CONNECTION,
  PVS_CONNECTION_INIT,
  clearPVSErr
} from 'state/actions/network'
import { RESET_PVS_INFO_STATE } from 'state/actions/pvs'
import { RESET_SITE } from 'state/actions/site'
import 'pages/ConnectToPVS/ConnectToPVS.scss'
import './ConnectionLost.scss'

const ConnectionLost = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { SSID, password, connected, connecting, err } = useSelector(
    pathOr({}, ['network'])
  )

  const { serialNumber } = useSelector(pathOr({}, ['pvs']))

  const exitSite = () => {
    dispatch(RESET_PVS_INFO_STATE())
    dispatch(RESET_PVS_CONNECTION())
    dispatch(RESET_DISCOVERY())
    dispatch(RESET_INVENTORY())
    dispatch(RESET_SITE())
    dispatch(RESET_LAST_VISITED_PAGE())
    history.push(paths.PROTECTED.ROOT.path)
  }

  const reconnectToPVS = () => {
    dispatch(RESET_DISCOVERY())
    dispatch(PVS_CONNECTION_INIT({ ssid: SSID, password }))
  }

  useEffect(() => {
    if (!connecting && connected) {
      history.push(paths.PROTECTED.SN_LIST.path)
    }
    if (!connecting && err) {
      dispatch(clearPVSErr())
    }
  }, [connected, connecting, err, dispatch, history, t])

  return (
    <div className="pvs-connection-lost-screen pr-20 pl-20">
      <h2 className="is-uppercase has-text-weight-bold">
        {t('CONNECTION_LOST')}
      </h2>
      <span className="sp-no-connection has-text-white" />

      <div className="mr-5 ml-5 is-size-6 has-text-centered">
        <p className="has-text-white mb-15">{t('RECONNECT0')}</p>
        <p>
          {t('RECONNECT1')}
          <span className="has-text-weight-bold ml-5 mr-5">
            {t('RECONNECT')}
          </span>
          {t('RECONNECT2')}
          <br />
        </p>
        <p className="has-text-centered mt-20 has-text-weight-bold">
          {serialNumber}
        </p>
        <p className="mt-20">{t('RECONNECT3')}</p>

        {either(err, <div className="message error mb-10 mt-10">{t(err)}</div>)}
      </div>

      <div className="actions is-flex">
        <button
          disabled={connecting}
          className="button is-outlined is-primary is-uppercase"
          onClick={exitSite}
        >
          {t('EXIT_SITE')}
        </button>

        {either(
          !isNil(serialNumber) && !isEmpty(serialNumber),
          <button
            disabled={connecting}
            className="button is-primary is-uppercase is-center is-small mt-20"
            onClick={reconnectToPVS}
          >
            {connecting ? t('CONNECTING') : t('RECONNECT')}
          </button>
        )}
      </div>
    </div>
  )
}

export default ConnectionLost
