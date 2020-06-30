import ErrorDetailScreen from 'pages/ErrorDetailScreen/ErrorDetail'
import React, { useLayoutEffect, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { withTracker } from 'shared/ga'
import { routeAuthorization, setLayout } from 'hocs'

import useUpgrade from 'hooks/useUpgrade'
import useCanceledPVSConnection from 'hooks/useCanceledPVSConnection'

import BillOfMaterials from 'pages/BillOfMaterials'
import ConnectionLost from 'pages/ConnectionLost'
import ConnectToPVS from 'pages/ConnectToPVS'
import CreateSite from 'pages/CreateSite'
import Data from 'pages/Data'
import Devices from 'pages/Devices'
import Firmwares from 'pages/Firmwares'
import GiveFeedback from 'pages/GiveFeedback'
import Home from 'pages/Home'
import InstallSuccessful from 'pages/InstallSuccess'
import InventoryCount from 'pages/InventoryCount'
import LegacyDiscovery from 'pages/LegacyDiscovery'
import Login from 'pages/Login'
import Menu from 'pages/Menu'
import ModelEdit from 'pages/ModelEdit'
import NotFound from 'pages/NotFound'
import PanelLayoutTool from 'pages/PanelLayoutTool/AddingPanels'
import PanelLayoutToolGroupPanels from 'pages/PanelLayoutTool/GroupPanels'
import PvsConnectionSuccessful from 'pages/PvsConnectionSuccessful'
import PVSProvideInternet from 'pages/PVSProvideInternet'
import SavingConfiguration from 'pages/SavingConfiguration'
import ScanLabels from 'pages/ScanLabels'
import SNList from 'pages/SNList'
import SystemConfiguration from 'pages/SystemConfiguration'
import UpdateScreen from 'pages/UpdateScreen'
import ESSDeviceMapping from 'pages/ESSDeviceMapping'
import ESSDeviceMappingError from 'pages/ESSDeviceMappingError'
import ESSDeviceMappingSuccess from 'pages/ESSDeviceMappingSuccess'
import EQSUpdate from 'pages/EQSUpdate'
import EQSUpdateErrors from 'pages/EQSUpdateErrors'
import ESSHealthCheck from 'pages/ESSHealthCheck'
import ESSHealthCheckErrors from 'pages/ESSHealthCheckErrors'
import VersionInformation from 'pages/VersionInformation'
import DebugPage from 'pages/DebugPage'

import { validateSession } from 'state/actions/auth'
import { updateBodyHeight } from 'shared/utils'
import { deviceResumeListener } from 'state/actions/mobile'
import useDownloader from 'hooks/useDownloader'

import paths from './paths'

const mapComponents = {
  [paths.PROTECTED.ERROR_DETAIL.path]: ErrorDetailScreen,
  [paths.PROTECTED.DEVICES.path]: Devices,
  [paths.PROTECTED.UPDATE.path]: UpdateScreen,
  [paths.PROTECTED.BILL_OF_MATERIALS.path]: BillOfMaterials,
  [paths.PROTECTED.CREATE_SITE.path]: CreateSite,
  [paths.PROTECTED.GIVE_FEEDBACK.path]: GiveFeedback,
  [paths.PROTECTED.DATA.path]: Data,
  [paths.PROTECTED.MANAGE_FIRMWARES.path]: Firmwares,
  [paths.PROTECTED.MENU.path]: Menu,
  [paths.PROTECTED.PANEL_LAYOUT_TOOL.path]: PanelLayoutTool,
  [paths.PROTECTED.PANEL_LAYOUT_TOOL_GROUPS.path]: PanelLayoutToolGroupPanels,
  [paths.PROTECTED.PVS_CONNECTION_SUCCESS.path]: PvsConnectionSuccessful,
  [paths.PROTECTED.PVS_PROVIDE_INTERNET.path]: PVSProvideInternet,
  [paths.PROTECTED.INSTALL_SUCCESS.path]: InstallSuccessful,
  [paths.PROTECTED.ROOT.path]: Home,
  [paths.PROTECTED.VERSION_INFORMATION.path]: VersionInformation,
  [paths.PROTECTED.INVENTORY_COUNT.path]: InventoryCount,
  [paths.PROTECTED.CONNECT_TO_PVS.path]: ConnectToPVS,
  [paths.PROTECTED.SCAN_LABELS.path]: ScanLabels,
  [paths.PROTECTED.SYSTEM_CONFIGURATION.path]: SystemConfiguration,
  [paths.PROTECTED.SAVING_CONFIGURATION.path]: SavingConfiguration,
  [paths.PROTECTED.SN_LIST.path]: SNList,
  [paths.PROTECTED.MODEL_EDIT.path]: ModelEdit,
  [paths.PROTECTED.LEGACY_DISCOVERY.path]: LegacyDiscovery,
  [paths.PROTECTED.CONNECTION_LOST.path]: ConnectionLost,
  [paths.PROTECTED.ESS_DEVICE_MAPPING.path]: ESSDeviceMapping,
  [paths.PROTECTED.ESS_DEVICE_MAPPING_ERROR.path]: ESSDeviceMappingError,
  [paths.PROTECTED.ESS_DEVICE_MAPPING_SUCCESS.path]: ESSDeviceMappingSuccess,
  [paths.PROTECTED.EQS_UPDATE.path]: EQSUpdate,
  [paths.PROTECTED.EQS_UPDATE_ERRORS.path]: EQSUpdateErrors,
  [paths.PROTECTED.ESS_HEALTH_CHECK.path]: ESSHealthCheck,
  [paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path]: ESSHealthCheckErrors,
  [paths.UNPROTECTED.FORGOT_PASSWORD.path]: NotFound,
  [paths.UNPROTECTED.GET_ASSISTANCE.path]: NotFound,
  [paths.UNPROTECTED.LOGIN.path]: Login,
  ...(process.env.REACT_APP_IS_TEST && {
    [paths.PROTECTED.DEBUG_PAGE.path]: DebugPage
  })
}
/**
 * The router of this app
 * @returns {*}
 * @constructor
 */
function AppRoutes() {
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  })

  useUpgrade()
  useDownloader()
  useCanceledPVSConnection()

  useEffect(() => {
    dispatch(deviceResumeListener())
    dispatch(validateSession())

    window.addEventListener('keyboardDidHide', updateBodyHeight)

    return () => {
      document.removeEventListener('keyboardDidHide', updateBodyHeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isLoggedIn = useSelector(({ user }) => user.auth.access_token)
  return (
    <div>
      <Switch>
        {Object.values(paths.UNPROTECTED).map(
          ({ path, header = false, footer = false }) => (
            <Route
              key={path}
              path={path}
              exact
              component={routeAuthorization(
                false,
                isLoggedIn
              )(setLayout(header, footer)(withTracker(mapComponents[path])))}
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
                isLoggedIn
              )(setLayout(header, footer)(withTracker(mapComponents[path])))}
            />
          )
        )}
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}

export default AppRoutes
