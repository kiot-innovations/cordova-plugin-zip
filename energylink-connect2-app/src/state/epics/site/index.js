import homeownerEpics from './createHomeOwnerAccout'
import { createSiteEpic } from './createSiteEpic'
import {
  decideIfShoudFetchSiteEpic,
  fetchSiteData,
  fetchSiteInfo,
  fetchSitesEpic
} from './fetchSitesEpic'

export default [
  createSiteEpic,
  fetchSiteData,
  ...homeownerEpics,
  fetchSitesEpic,
  fetchSiteInfo,
  decideIfShoudFetchSiteEpic
]
