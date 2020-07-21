import { fetchSiteData, fetchSitesEpic } from './fetchSitesEpic'
import { createSiteEpic } from './createSiteEpic'

export default [fetchSitesEpic, createSiteEpic, fetchSiteData]
