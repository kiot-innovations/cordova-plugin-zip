import loginEpics from './loginEpics'
import { errorEpic } from './errorEpic'
import scanPVS from './scanPVSEpics'
import siteEpics from './findSiteEpics'
import configureEpics from './configureEpics'
import inventoryEpics from './InventoryEpics'
import deviceResumeEpic from './deviceResumeEpic'
import firmwareUpdate from './firmwareUpdate'
import deviceTracking from './deviceTracking'
import homeOwnerAccountAnalytics from './homeOwnerAccountCreation'
import acModelsEpic from './acModelsMetadata'
import trackDisReconnectionPVS from './trackDisReconnectionPVS'
import pvsInternetEpic from './pvsInternetEpic'
import pltWizard from './panelLayoutTool'
import bulkSettingsEpic from './bulkSettingsEpic'

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
  pvsInternetEpic
]
