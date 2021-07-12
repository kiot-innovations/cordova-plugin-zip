import acModelsEpic from './acModelsMetadata'
import bulkSettingsEpic from './bulkSettingsEpic'
import configureEpics from './configureEpics'
import deviceResumeEpic from './deviceResumeEpic'
import deviceTracking from './deviceTracking'
import { errorEpic } from './errorEpic'
import siteEpics from './findSiteEpics'
import firmwareUpdate from './firmwareUpdate'
import homeOwnerAccountAnalytics from './homeOwnerAccountCreation'
import inventoryEpics from './InventoryEpics'
import loginEpics from './loginEpics'
import pltWizard from './panelLayoutTool'
import pvsInternetEpic from './pvsInternetEpic'
import scanMicroInverters from './scanMicroInvertersEpic'
import scanPVS from './scanPVSEpics'
import trackDisReconnectionPVS from './trackDisReconnectionPVS'

export default [
  ...acModelsEpic,
  ...bulkSettingsEpic,
  ...configureEpics,
  ...deviceResumeEpic,
  ...deviceTracking,
  ...firmwareUpdate,
  ...trackDisReconnectionPVS,
  ...homeOwnerAccountAnalytics,
  ...inventoryEpics,
  ...loginEpics,
  ...pltWizard,
  ...scanPVS,
  ...siteEpics,
  errorEpic,
  pvsInternetEpic,
  scanMicroInverters
]
