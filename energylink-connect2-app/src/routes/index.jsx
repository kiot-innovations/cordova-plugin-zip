import useUpgrade from 'hooks/useUpgrade'
import UpdateScreen from 'pages/UpdateScreen'
import {
  always,
  compose,
  cond,
  equals,
  find,
  gt,
  ifElse,
  path,
  propEq,
  T
} from 'ramda'
import React, { useLayoutEffect, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { animated, useTransition } from 'react-spring'
import { useDispatch } from 'react-redux'
import { useRouter } from 'hooks'
import { protectedRoutes, TABS } from 'routes/paths'
import { withTracker } from 'shared/ga'
import { routeAuthorization, setLayout } from 'hocs'
import { deviceResumeListener } from 'state/actions/mobile'

import CreateSite from 'pages/CreateSite'
import Firmwares from 'pages/Firmwares'
import Home from 'pages/Home'
import Data from 'pages/Data'
import Login from 'pages/Login'
import Menu from 'pages/Menu'
import NotFound from 'pages/NotFound'
import ConnectToPVS from 'pages/ConnectToPVS'
import PvsConnectionSuccessful from 'pages/PvsConnectionSuccessful'
import BillOfMaterials from 'pages/BillOfMaterials'
import InventoryCount from 'pages/InventoryCount'
import ScanLabels from 'pages/ScanLabels'
import GiveFeedback from 'pages/GiveFeedback'
import SNList from 'pages/SNList'
import Devices from 'pages/Devices'
import ModelEdit from 'pages/ModelEdit'
import InstallSuccessful from 'pages/InstallSuccess'
import SystemConfiguration from 'pages/SystemConfiguration'
import SavingConfiguration from 'pages/SavingConfiguration'
import Logout from 'pages/Logout'
import PanelLayoutTool from 'pages/PanelLayoutTool/AddingPanels'
import PanelLayoutToolGroupPanels from 'pages/PanelLayoutTool/GroupPanels'
import paths from './paths'
import { validateSession } from 'state/actions/auth'
import { updateBodyHeight } from 'shared/utils'

const mapComponents = {
  [paths.PROTECTED.DEVICES.path]: Devices,
  [paths.PROTECTED.UPDATE.path]: UpdateScreen,
  [paths.PROTECTED.BILL_OF_MATERIALS.path]: BillOfMaterials,
  [paths.PROTECTED.CREATE_SITE.path]: CreateSite,
  [paths.PROTECTED.GIVE_FEEDBACK.path]: GiveFeedback,
  [paths.PROTECTED.DATA.path]: Data,
  [paths.PROTECTED.LOGOUT.path]: NotFound,
  [paths.PROTECTED.MANAGE_FIRMWARES.path]: Firmwares,
  [paths.PROTECTED.MENU.path]: Menu,
  [paths.PROTECTED.PANEL_LAYOUT_TOOL.path]: PanelLayoutTool,
  [paths.PROTECTED.PANEL_LAYOUT_TOOL_GROUPS.path]: PanelLayoutToolGroupPanels,
  [paths.PROTECTED.PVS_CONNECTION_SUCCESS.path]: PvsConnectionSuccessful,
  [paths.PROTECTED.INSTALL_SUCCESS.path]: InstallSuccessful,
  [paths.PROTECTED.ROOT.path]: Home,
  [paths.PROTECTED.VERSION_INFORMATION.path]: PanelLayoutTool,
  [paths.PROTECTED.INVENTORY_COUNT.path]: InventoryCount,
  [paths.PROTECTED.CONNECT_TO_PVS.path]: ConnectToPVS,
  [paths.PROTECTED.SCAN_LABELS.path]: ScanLabels,
  [paths.PROTECTED.SYSTEM_CONFIGURATION.path]: SystemConfiguration,
  [paths.PROTECTED.SAVING_CONFIGURATION.path]: SavingConfiguration,
  [paths.PROTECTED.SN_LIST.path]: SNList,
  [paths.PROTECTED.MODEL_EDIT.path]: ModelEdit,
  [paths.UNPROTECTED.FORGOT_PASSWORD.path]: NotFound,
  [paths.UNPROTECTED.GET_ASSISTANCE.path]: NotFound,
  [paths.UNPROTECTED.LOGIN.path]: Login,
  [paths.UNPROTECTED.LOGOUT.path]: Logout
}

const isTab = tab => compose(equals(tab), path(['tab']))

const getTabNumber = cond([
  [isTab(TABS.DATA), always(4)],
  [isTab(TABS.CONFIGURE), always(3)],
  [isTab(TABS.INSTALL), always(2)],
  [isTab(TABS.HOME), always(1)],
  [T, always(-1)]
])
const animationCSS = ifElse(
  gt,
  always({ opacity: 0, transform: 'translate(100%,0)' }),
  always({ opacity: 0, transform: 'translate(-100%,0)' })
)

const getTabNumberFromPathname = (actualScreen = '', protectedRoutes) =>
  getTabNumber(find(propEq('path', actualScreen), protectedRoutes))

/**
 * The router of this app
 * @returns {*}
 * @constructor
 */
function AppRoutes() {
  const dispatch = useDispatch()
  const { location } = useRouter()
  const [lastTab, setLastTab] = useState()

  useEffect(() => {
    setLastTab(getTabNumberFromPathname(location.pathname, protectedRoutes))
  }, [location])

  const fadeIn = useTransition(location, loc => loc.pathname, {
    unique: true,
    from: () => {
      const actualTab = getTabNumberFromPathname(
        location.pathname,
        protectedRoutes
      )
      return animationCSS(actualTab, lastTab)
    },
    enter: { opacity: 1, transform: 'translate(0%,0%)' },
    leave: () => {
      const actualTab = getTabNumberFromPathname(
        location.pathname,
        protectedRoutes
      )
      return animationCSS(lastTab, actualTab)
    }
  })

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  })
  useUpgrade()

  useEffect(() => {
    dispatch(deviceResumeListener())
    dispatch(validateSession())

    window.addEventListener('keyboardDidHide', updateBodyHeight)

    return () => {
      document.removeEventListener('keyboardDidHide', updateBodyHeight)
    }
  }, [dispatch])

  const isLoggedIn = useSelector(({ user }) => user.auth.access_token)
  return fadeIn.map(({ item, props, key, state }) => (
    <animated.div key={key} style={props}>
      <Switch location={item}>
        {Object.values(paths.UNPROTECTED).map(
          ({ path, header = false, footer = false }) => (
            <Route
              key={path}
              path={path}
              exact
              component={routeAuthorization(
                false,
                isLoggedIn,
                state
              )(
                setLayout(
                  header,
                  footer,
                  state
                )(withTracker(mapComponents[path]))
              )}
            />
          )
        )}
        {Object.values(paths.PROTECTED).map(
          ({ path, header = false, footer = false }) => (
            <Route
              key={path}
              path={path}
              exact
              component={routeAuthorization(
                true,
                isLoggedIn,
                state
              )(
                setLayout(
                  header,
                  footer,
                  state
                )(withTracker(mapComponents[path]))
              )}
            />
          )
        )}
        <Route component={NotFound} />
      </Switch>
    </animated.div>
  ))
}

export default AppRoutes
