import {
  compose,
  equals,
  filter,
  length,
  map as mapR,
  path,
  pathOr,
  prop,
  reject
} from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  tap,
  filter as filterX,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiSite, getApiSearch } from 'shared/api'
import { getSitePayload, getSiteState } from 'shared/siteHelpers'
import { cleanString } from 'shared/utils'
import * as devicesActions from 'state/actions/devices'
import * as siteActions from 'state/actions/site'

const getAccessToken = path(['user', 'auth', 'access_token'])

const accessValue = prop('_source')

const getSitesByText = (text, access_token) =>
  getApiSearch(access_token)
    .then(path(['apis', '/v2']))
    .then(api =>
      api.get_v2_search_index_site({
        indexId: 'site',
        q: text,
        pg: 1
      })
    )
    .then(pathOr([], ['body', 'items', 'hits']))
    .then(mapR(accessValue))

const isExpansionSite = site => site.siteRelationType === 'EXPANSION'

export const fetchSitesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(siteActions.GET_SITES_INIT.getType()),
    switchMap(({ payload }) =>
      from(getSitesByText(payload, getAccessToken(state$.value))).pipe(
        map(sites => {
          const filteredSites = reject(isExpansionSite)(sites)
          return length(filteredSites) < 1
            ? siteActions.NO_SITE_FOUND(payload)
            : siteActions.GET_SITES_SUCCESS(mapRawSites(filteredSites))
        }),
        catchError(error => {
          Sentry.captureException(error)
          return of(siteActions.NO_SITE_FOUND(payload))
        })
      )
    )
  )
}

export const toUISite = rawSite => ({
  site: getSitePayload(rawSite),
  state: getSiteState(rawSite)
})
const mapRawSites = mapR(toUISite)

export const decideIfShoudFetchSiteEpic = (action$, state$) => {
  return action$.pipe(
    ofType(siteActions.GET_SITES_FILTERING.getType()),
    map(path(['payload', 'value'])),
    map(cleanString),
    filterX(text => text.trim().length > 2),
    debounceTime(1000),
    distinctUntilChanged(),
    map(siteActions.GET_SITES_INIT)
  )
}

export const fetchSiteData = (action$, state$) => {
  const filterPVS = filter(compose(equals('DATALOGGER'), prop('deviceType')))

  async function getSiteDataPromise(accessToken, siteKey = '') {
    const api = await getApiSite(accessToken)
    const res = await api.apis.default.get_v1_site_assignment({ siteKey })
    return JSON.parse(res.data)
  }

  return action$.pipe(
    ofType(siteActions.GET_SITE_INIT.getType()),
    exhaustMap(({ payload }) =>
      from(getSiteDataPromise(getAccessToken(state$.value), payload)).pipe(
        switchMap(siteData =>
          of(
            siteActions.GET_SITE_SUCCESS(filterPVS(siteData)),
            devicesActions.FETCH_DEVICES_LIST()
          )
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(
            siteActions.GET_SITE_ERROR({ message: 'ERROR GETTING SITE' })
          )
        })
      )
    )
  )
}

async function getSiteInfoPromise(accessToken, siteId = '') {
  const api = await getApiSite(accessToken)
  const getSite = path(['apis', '/v1', 'getSite'], api)
  if (!getSite) throw new Error('NOT_IMPLEMENTED')
  const res = await getSite({ siteKey: siteId })
  return res.body
}

export const fetchSiteInfo = (action$, state$) => {
  return action$.pipe(
    ofType(siteActions.ON_GET_SITE_INFO.getType()),
    exhaustMap(({ payload }) =>
      from(getSiteInfoPromise(getAccessToken(state$.value), payload)).pipe(
        tap(e => console.info({ e })),
        map(siteInfo =>
          siteActions.ON_GET_SITE_INFO_END({
            error: false,
            contractNumber: pathOr(
              'N/A',
              ['energyContracts', '0', 'contractNumber'],
              siteInfo
            ),
            financeType: pathOr(
              'N/A',
              ['energyContracts', '0', 'financeType'],
              siteInfo
            )
          })
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(
            siteActions.ON_GET_SITE_INFO_END({
              error: true,
              message: error.message
            })
          )
        })
      )
    )
  )
}
