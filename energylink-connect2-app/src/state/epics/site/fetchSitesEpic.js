import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  switchMap
} from 'rxjs/operators'
import {
  compose,
  converge,
  equals,
  filter,
  map as mapR,
  path,
  pathOr,
  prop
} from 'ramda'
import * as siteActions from 'state/actions/site'
import * as devicesActions from 'state/actions/devices'
import * as authActions from 'state/actions/auth'
import { getApiParty, getApiSite } from 'shared/api'

const getAccessToken = path(['user', 'auth', 'access_token'])
const getPartyId = path(['user', 'data', 'partyId'])
const getAPIMethods = path(['apis', 'default'])

const getSitesPromises = (access_token, sites) =>
  sites.map(({ siteKey }) =>
    getApiSite(access_token)
      .then(path(['apis', 'default']))
      .then(api => api.get_v1_site__siteKey_({ siteKey }))
  )

const getPartiesPromise = (access_token, partyId) =>
  getApiParty(access_token)
    .then(getAPIMethods)
    .then(apiParty => apiParty.get_v2_party__partyId__site({ partyId }))
    .then(pathOr([], ['body', 'relations']))
    .then(sites => Promise.all(getSitesPromises(access_token, sites)))

const getParties = converge(getPartiesPromise, [getAccessToken, getPartyId])

export const fetchSitesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(
      siteActions.GET_SITES_INIT.getType(),
      authActions.REFRESH_TOKEN_SUCCESS.getType()
    ),
    mergeMap(() =>
      from(getParties(state$.value)).pipe(
        map(response => {
          const sites = filter(Boolean, mapR(prop('body'), response)) || []
          return sites.length > 0
            ? siteActions.GET_SITES_SUCCESS(sites)
            : siteActions.GET_SITES_ERROR({ message: 'NO_SITES' })
        }),
        catchError(error => {
          Sentry.captureException(error)
          return of(siteActions.GET_SITES_ERROR(error))
        })
      )
    )
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
