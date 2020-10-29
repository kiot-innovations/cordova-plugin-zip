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
// TODO: THIS IS THE WRONG OWNER BUT EDP REQUIRES AN OWNER AT THIS TIME WE
// SHOULD NOT USE THE LOGGED IN USERS' INFORMATION AS THE OWNER FOR THE SITE.
// THE SITE OWNER SHOULD BE THE HOMEOWNER OR COMMERCIAL BUSINESS OWNER
const getOwner = pipe(path(['user', 'data']), pick(['partyId', 'partyType']))
const getServicer = pipe(path(['user', 'data']), pick(['parentPartyId']))
const getOrDefaultParentPartnerId = ifElse(
  equals('SUNPOWER_GLOBAL'),
  always(process.env.REACT_APP_DEFAULT_PARTNER_ID),
  identity
)

const postCreateSite = curry(
  (access_token, owner, { parentPartyId }, payload) =>
    getApiSite(access_token)
      .then(path(['apis', 'default']))
      .then(api =>
        api.post_v1_site(
          {},
          {
            requestBody: {
              ...payload,
              siteType: 'RESIDENTIAL',
              siteTypeId: 1,
              address1: payload.address,
              city: payload.city,
              owner,
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

const createSite = converge(postCreateSite, [
  getAccessToken,
  getOwner,
  getServicer
])

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
