import Nav from '@sunpower/nav'
import clsx from 'clsx'
import { isNil } from 'ramda'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import useSiteKey from 'hooks/useSiteKey'
import paths, { protectedRoutes, TABS } from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { BEGIN_INSTALL } from 'state/actions/analytics'
import { SET_LAST_VISITED_PAGE } from 'state/actions/global'
import { appConnectionStatus } from 'state/reducers/network'

import './footer.scss'

const isActive = (path = '', tab = '') =>
  !!protectedRoutes.find(elem => elem.path === path && elem.tab === tab)

//The animation values that we are going to use are
//
// closed -> maxHeight: 0, opacity: 0
// open -> maxHeight: 90, opacity: 1

const Footer = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const t = useI18n()

  const showFooter = useSelector(({ ui }) => !!ui.footer)
  const { connectionStatus } = useSelector(state => state.network)
  const { lastVisitedPage, showPrecommissioningChecklist } = useSelector(
    state => state.global
  )

  const {
    essUpdateOverride,
    pvsUpdateOverride,
    doNotUpdatePVS,
    doNotUpdateESS
  } = useSelector(state => state.fileDownloader.settings)

  const { showSuperuserSettings } = useSelector(state => state.superuser)

  const location = useLocation()
  const siteKey = useSiteKey()
  const active = useMemo(
    () => ({
      home: isActive(location.pathname, TABS.HOME),
      install: isActive(location.pathname, TABS.INSTALL),
      configure: isActive(location.pathname, TABS.CONFIGURE),
      data: isActive(location.pathname, TABS.DATA)
    }),
    [location]
  )

  useEffect(() => {
    if (active.install) {
      const destination =
        connectionStatus === appConnectionStatus.CONNECTED
          ? location.pathname
          : paths.PROTECTED.PVS_SELECTION_SCREEN.path
      dispatch(SET_LAST_VISITED_PAGE(destination))
    }
  }, [active, connectionStatus, dispatch, location])

  function redirect(path) {
    if (path !== location.pathname) history.push(path)
  }

  const installRedirect = lastVisitedPage => {
    if (isNil(lastVisitedPage)) {
      dispatch(BEGIN_INSTALL({ siteKey }))
      return showPrecommissioningChecklist
        ? paths.PROTECTED.PRECOMM_CHECKLIST.path
        : paths.PROTECTED.PVS_SELECTION_SCREEN.path
    }
    return lastVisitedPage
  }

  const configureClickHandler =
    connectionStatus === appConnectionStatus.CONNECTED
      ? () => redirect(paths.PROTECTED.SYSTEM_CONFIGURATION.path)
      : () => {}

  const liveDataClickHandler =
    connectionStatus === appConnectionStatus.CONNECTED
      ? () => redirect(paths.PROTECTED.DATA.path)
      : () => {}

  const navBarItems = [
    {
      icon: 'sp-home',
      text: 'Home',
      onClick: () => redirect(paths.PROTECTED.BILL_OF_MATERIALS.path),
      active: active.home
    },
    {
      icon: 'sp-list',
      text: 'Install',
      onClick: () => redirect(installRedirect(lastVisitedPage)),
      active: active.install
    },
    {
      icon: 'sp-signal',
      text: 'Configure',
      onClick: configureClickHandler,
      active: active.configure
    },
    {
      icon: 'sp-data',
      text: 'Status',
      onClick: liveDataClickHandler,
      active: active.data
    }
  ]

  return (
    <div className="cm2-footer">
      <footer
        className={clsx('custom-footer is-clipper', {
          'show-footer': showFooter,
          'hide-footer': !showFooter
        })}
      >
        <Nav items={navBarItems} />
        {either(
          showSuperuserSettings,
          <div className="superuser-settings is-clipper">
            {either(
              pvsUpdateOverride.displayName,
              <span>
                {t('SUPERUSER_PVS')}:
                {either(
                  pvsUpdateOverride.displayName,
                  pvsUpdateOverride.displayName,
                  '-'
                )}
              </span>
            )}

            <span> {either(doNotUpdatePVS, 'SUPERUSER_PVS_NO_FWUP')}</span>

            {either(
              pvsUpdateOverride.displayName,
              <span>
                {t('SUPERUSER_CD')}:
                {either(
                  essUpdateOverride.displayName,
                  essUpdateOverride.displayName,
                  '-'
                )}
              </span>
            )}
            <span> {either(doNotUpdateESS, t('SUPERUSER_CD_NO_FWUP'))}</span>
          </div>
        )}
      </footer>
    </div>
  )
}

export default Footer
