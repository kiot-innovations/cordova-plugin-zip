import { fetchSiteData, fetchSitesEpic } from './fetchSitesEpic'
import { createSiteEpic } from './createSiteEpic'

export default [createSiteEpic, fetchSiteData, fetchSitesEpic]
