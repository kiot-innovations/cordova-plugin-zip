import { loginErrorEpic, loginSuccessEpic } from './loginEpics'
import { errorEpic } from './errorEpic'
import scanPVS from './scanPVSEpics'
import siteEpics from './findSiteEpics'
import configureEpics from './configureEpics'
import inventoryEpics from './InventoryEpics'
import deviceResumeEpic from './deviceResumeEpic'
import firmwareUpdate from './firmwareUpdate'
import acModelsEpic from './acModelsMetadata'
import pltWizard from './panelLayoutTool'

export default [
  ...acModelsEpic,
  ...configureEpics,
  ...deviceResumeEpic,
  ...firmwareUpdate,
  ...inventoryEpics,
  ...pltWizard,
  ...scanPVS,
  ...siteEpics,
  errorEpic,
  loginErrorEpic,
  loginSuccessEpic
]
