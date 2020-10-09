import { loginErrorEpic, loginSuccessEpic } from './loginEpics'
import { errorEpic } from './errorEpic'
import siteEpics from './findSiteEpics'

export default [loginSuccessEpic, loginErrorEpic, errorEpic, ...siteEpics]
