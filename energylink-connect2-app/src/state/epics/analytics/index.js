import { loginErrorEpic, loginSuccessEpic } from './loginEpics'
import { errorEpic } from './errorEpic'
import scanPVS from './scanPVSEpics'
import siteEpics from './findSiteEpics'
import configureEpics from './configureEpics'
import deviceResumeEpic from './deviceResumeEpic'

export default [
  loginSuccessEpic,
  loginErrorEpic,
  errorEpic,
  ...deviceResumeEpic,
  ...siteEpics,
  ...configureEpics,
  ...scanPVS
]
