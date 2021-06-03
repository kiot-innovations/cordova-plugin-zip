import { fetchSiteData, fetchSiteInfo, fetchSitesEpic } from './fetchSitesEpic'
import { createSiteEpic } from './createSiteEpic'
import homeownerEpics from './createHomeOwnerAccout'

export default [
  createSiteEpic,
  fetchSiteData,
  ...homeownerEpics,
  fetchSitesEpic,
  fetchSiteInfo
]
