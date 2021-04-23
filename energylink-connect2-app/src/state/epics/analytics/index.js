import loginEpics from './loginEpics'
import { errorEpic } from './errorEpic'
import scanPVS from './scanPVSEpics'
import siteEpics from './findSiteEpics'
import configureEpics from './configureEpics'
import inventoryEpics from './InventoryEpics'
import deviceResumeEpic from './deviceResumeEpic'
import firmwareUpdate from './firmwareUpdate'
import homeOwnerAccountAnalytics from './homeOwnerAccountCreation'
import acModelsEpic from './acModelsMetadata'
import pvsInternetEpic from './pvsInternetEpic'
import pltWizard from './panelLayoutTool'
import bulkSettingsEpic from './bulkSettingsEpic'

export default [
  ...acModelsEpic,
  ...bulkSettingsEpic,
  ...configureEpics,
  ...deviceResumeEpic,
  ...firmwareUpdate,
  ...homeOwnerAccountAnalytics,
  ...inventoryEpics,
  ...loginEpics,
  ...pltWizard,
  ...scanPVS,
  ...siteEpics,
  errorEpic,
  pvsInternetEpic
]
