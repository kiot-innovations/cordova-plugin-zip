import ErrorDetailScreen from 'pages/ErrorDetailScreen/ErrorDetail'
import React, { useLayoutEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import { map } from 'ramda'
import { withTracker } from 'shared/ga'
import { routeAuthorization, setLayout } from 'hocs'

import BillOfMaterials from 'pages/BillOfMaterials'
import ConnectionLost from 'pages/ConnectionLost'
import ConnectToPVS from 'pages/ConnectToPVS'
import CreateSite from 'pages/CreateSite'
import Data from 'pages/Data'
import Devices from 'pages/Devices'
import Home from 'pages/Home'
import InstallSuccessful from 'pages/InstallSuccess'
import InventoryCount from 'pages/InventoryCount'
import LegacyDiscovery from 'pages/LegacyDiscovery'
import Login from 'pages/Login'
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
import ESSDeviceMappingErrorList from 'pages/ESSDeviceMappingErrorList'
import ESSDeviceMappingSuccess from 'pages/ESSDeviceMappingSuccess'
import EQSUpdate from 'pages/EQSUpdate'
import EQSUpdateErrors from 'pages/EQSUpdateErrors'
import EQSPrediscoveryErrors from 'pages/EQSPrediscoveryErrors'
import ESSHealthCheck from 'pages/ESSHealthCheck'
import ESSHealthCheckErrors from 'pages/ESSHealthCheckErrors'
import StoragePrediscovery from 'pages/StoragePrediscovery'
import DebugPage from 'pages/DebugPage'
import PvsSelection from 'pages/PvsSelection'
import ExistingDevices from 'pages/ExistingDevices'
import RMAInventory from 'pages/RMAInventory'
import RMASnList from 'pages/RMASnList'
import RMAMiDiscovery from 'pages/RMAMiDiscovery'
import RMADevices from 'pages/RMADevices'
import GetAssistance from 'pages/GetAssistance'
import Permissions from 'pages/Permissions'
import PreCommissioning from 'pages/PreCommissioning'
import NearbyPVS from 'pages/NearbyPVS'
import Settings from 'pages/Settings'
import PrecommissioningConfigs from 'pages/PrecommissioningConfigs'
import LegacyDiscoverySelector from 'pages/LegacyDiscoverySelector'
import AnalyticsConsent from 'pages/AnalyticsConsent'

import { isDebug } from 'shared/utils'

import paths from './paths'

const mapComponents = {
  [paths.PROTECTED.RMA_INVENTORY.path]: RMAInventory,
  [paths.PROTECTED.RMA_SN_LIST.path]: RMASnList,
  [paths.PROTECTED.ERROR_DETAIL.path]: ErrorDetailScreen,
  [paths.PROTECTED.DEVICES.path]: Devices,
  [paths.PROTECTED.UPDATE.path]: UpdateScreen,
  [paths.PROTECTED.PVS_SELECTION_SCREEN.path]: PvsSelection,
  [paths.PROTECTED.BILL_OF_MATERIALS.path]: BillOfMaterials,
  [paths.PROTECTED.CREATE_SITE.path]: CreateSite,
  [paths.PROTECTED.DATA.path]: Data,
  [paths.PROTECTED.PANEL_LAYOUT_TOOL.path]: PanelLayoutTool,
  [paths.PROTECTED.PANEL_LAYOUT_TOOL_GROUPS.path]: PanelLayoutToolGroupPanels,
  [paths.PROTECTED.PVS_CONNECTION_SUCCESS.path]: PvsConnectionSuccessful,
  [paths.PROTECTED.PVS_PROVIDE_INTERNET.path]: PVSProvideInternet,
  [paths.PROTECTED.INSTALL_SUCCESS.path]: InstallSuccessful,
  [paths.PROTECTED.ROOT.path]: Home,
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
  [paths.PROTECTED.ESS_DEVICE_MAPPING_ERROR_LIST
    .path]: ESSDeviceMappingErrorList,
  [paths.PROTECTED.ESS_DEVICE_MAPPING_SUCCESS.path]: ESSDeviceMappingSuccess,
  [paths.PROTECTED.EQS_UPDATE.path]: EQSUpdate,
  [paths.PROTECTED.EQS_UPDATE_ERRORS.path]: EQSUpdateErrors,
  [paths.PROTECTED.STORAGE_PREDISCOVERY.path]: StoragePrediscovery,
  [paths.PROTECTED.EQS_PREDISCOVERY_ERRORS.path]: EQSPrediscoveryErrors,
  [paths.PROTECTED.ESS_HEALTH_CHECK.path]: ESSHealthCheck,
  [paths.PROTECTED.ESS_HEALTH_CHECK_ERRORS.path]: ESSHealthCheckErrors,
  [paths.PROTECTED.RMA_EXISTING_DEVICES.path]: ExistingDevices,
  [paths.PROTECTED.RMA_MI_DISCOVERY.path]: RMAMiDiscovery,
  [paths.PROTECTED.PRECOMM_CHECKLIST.path]: PreCommissioning,
  [paths.PROTECTED.PERMISSIONS.path]: Permissions,
  [paths.PROTECTED.NEARBY_PVS.path]: NearbyPVS,
  [paths.PROTECTED.PRECOMMISSIONING_CONFIGS.path]: PrecommissioningConfigs,
  [paths.PROTECTED.LEGACY_DISCOVERY_SELECTOR.path]: LegacyDiscoverySelector,
  [paths.PROTECTED.RMA_DEVICES.path]: RMADevices,
  [paths.UNPROTECTED.FORGOT_PASSWORD.path]: NotFound,
  [paths.UNPROTECTED.LOGIN.path]: Login,
  [paths.UNPROTECTED.GET_ASSISTANCE.path]: GetAssistance,
  [paths.PROTECTED.PERMISSIONS.path]: Permissions,
  [paths.PROTECTED.NEARBY_PVS.path]: NearbyPVS,
  [paths.PROTECTED.SETTINGS.path]: Settings,
  [paths.PROTECTED.LEGACY_DISCOVERY_SELECTOR.path]: LegacyDiscoverySelector,
  [paths.UNPROTECTED.ANALYTICS_CONSENT.path]: AnalyticsConsent
}

if (isDebug) mapComponents[paths.PROTECTED.DEBUG_PAGE.path] = DebugPage

const renderRoute = isProtected => ({
  path,
  header = false,
  footer = false
}) => (
  <Route
    key={path}
    path={path}
    exact
    component={routeAuthorization(isProtected)(
      setLayout(header, footer)(withTracker(mapComponents[path]))
    )}
  />
)

const unprotectedRoutesValues = Object.values(paths.UNPROTECTED)
const protectedRoutesValues = Object.values(paths.PROTECTED)

const renderedProtected = map(renderRoute(true), protectedRoutesValues)
const renderedUnprotected = map(renderRoute(false), unprotectedRoutesValues)

function AppRoutes() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <div>
      <Switch>
        {renderedUnprotected}
        {renderedProtected}
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}

export default AppRoutes
