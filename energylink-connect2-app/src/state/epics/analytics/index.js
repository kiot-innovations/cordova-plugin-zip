import { loginErrorEpic, loginSuccessEpic } from './loginEpics'
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

export default [
  loginErrorEpic,
  loginSuccessEpic,
  errorEpic,
  ...scanPVS,
  ...siteEpics,
  ...configureEpics,
  ...inventoryEpics,
  ...deviceResumeEpic,
  ...firmwareUpdate,
  ...homeOwnerAccountAnalytics,
  ...acModelsEpic,
  pvsInternetEpic,
  ...pltWizard
]
