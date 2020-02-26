import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { path, converge, prop, pathOr, map as mapR, filter } from 'ramda'
import * as siteActions from 'state/actions/site'
import * as authActions from 'state/actions/auth'
import { getApiParty } from 'shared/api'
import { httpGet } from 'shared/fetch'

const getAccessToken = path(['user', 'auth', 'access_token'])
const getPartyId = path(['user', 'data', 'partyId'])
const getAPIMethods = path(['apis', 'default'])

const getSitesPromises = (access_token, sites) =>
  sites.map(site => httpGet(`/site/${site.siteKey}`, null, access_token))

const getPartiesPromise = (access_token, partyId) =>
  getApiParty(access_token)
    .then(getAPIMethods)
    .then(apiParty => apiParty.get_v2_party__partyId__site({ partyId }))
    .then(pathOr([], ['obj', 'relations']))
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
          const sites = filter(Boolean, mapR(prop('data'), response)) || []
          return sites.length > 0
            ? siteActions.GET_SITES_SUCCESS(sites)
            : siteActions.GET_SITES_ERROR({ message: 'NO_SITES' })
        }),
        catchError(error => of(siteActions.GET_SITES_ERROR(error)))
      )
    )
  )
}
