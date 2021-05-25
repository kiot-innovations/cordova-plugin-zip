import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import {
  always,
  converge,
  curry,
  equals,
  evolve,
  identity,
  ifElse,
  last,
  path,
  pick,
  pipe,
  split
} from 'ramda'
import * as siteActions from 'state/actions/site'
import { getApiSite } from 'shared/api'
import { cleanString } from 'shared/utils'

const getAccessToken = path(['user', 'auth', 'access_token'])
const getServicer = pipe(path(['user', 'data']), pick(['parentPartyId']))
const getOrDefaultParentPartnerId = ifElse(
  equals('SUNPOWER_GLOBAL'),
  always(process.env.REACT_APP_DEFAULT_PARTNER_ID),
  identity
)

const getAPI = o =>
  path(['apis', '/v2', 'createSiteMDS'], o) ||
  path(['apis', 'default', 'post_v1_site'], o)

const postCreateSite = curry((access_token, { parentPartyId }, payload) =>
  getApiSite(access_token)
    .then(getAPI)
    .then(createSite =>
      createSite(
        {},
        {
          requestBody: {
            ...payload,
            siteType: 'RESIDENTIAL',
            siteTypeId: 1,
            address1: payload.address,
            city: payload.city,
            servicer: {
              partyId: getOrDefaultParentPartnerId(parentPartyId),
              partyType: 'ORGANIZATION',
              smsPartyId: last(
                split('_')(getOrDefaultParentPartnerId(parentPartyId))
              )
            }
          }
        }
      )
    )
)

const createSite = converge(postCreateSite, [getAccessToken, getServicer])

const transformations = {
  siteName: cleanString,
  city: cleanString,
  postalCode: cleanString,
  state: cleanString,
  address: cleanString
}
const sanitizePayload = evolve(transformations)

export const createSiteEpic = (action$, state$) =>
  action$.pipe(
    ofType(siteActions.CREATE_SITE_INIT.getType()),
    exhaustMap(({ payload }) =>
      from(createSite(state$.value)(sanitizePayload(payload))).pipe(
        map(siteActions.CREATE_SITE_SUCCESS),
        catchError(error => {
          Sentry.captureException(error)
          return of(siteActions.CREATE_SITE_ERROR.asError(error))
        })
      )
    )
  )
