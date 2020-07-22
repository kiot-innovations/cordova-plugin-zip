import { fetchSiteData } from './fetchSitesEpic'
import { createSiteEpic } from './createSiteEpic'

export default [createSiteEpic, fetchSiteData]
