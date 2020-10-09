import { loginErrorEpic, loginSuccessEpic } from './loginEpics'
import { errorEpic } from './errorEpic'
import scanPVS from './scanPVSEpics'
import siteEpics from './findSiteEpics'
import configureEpics from './configureEpics'

export default [
  loginSuccessEpic,
  loginErrorEpic,
  errorEpic,
  ...siteEpics,
  ...configureEpics,
  ...scanPVS
]
