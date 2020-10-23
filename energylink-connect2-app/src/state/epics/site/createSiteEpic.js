import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import {
  always,
  converge,
  curry,
  equals,
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

const getAccessToken = path(['user', 'auth', 'access_token'])
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

export const createSiteEpic = (action$, state$) => {
  return action$.pipe(
    ofType(siteActions.CREATE_SITE_INIT.getType()),
    exhaustMap(({ payload }) =>
      from(createSite(state$.value)(payload)).pipe(
        map(response => siteActions.CREATE_SITE_SUCCESS()),
        catchError(error => {
          Sentry.captureException(error)
          return of(siteActions.CREATE_SITE_ERROR.asError(error))
        })
      )
    )
  )
}
