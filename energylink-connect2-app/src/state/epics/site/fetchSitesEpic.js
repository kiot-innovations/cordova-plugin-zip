import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { path } from 'ramda'
import { httpGet } from 'shared/fetch'
import * as siteActions from 'state/actions/site'

export const fetchSitesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(siteActions.GET_SITES_INIT.getType()),
    mergeMap(() => {
      const access_token = path(
        ['value', 'user', 'auth', 'access_token'],
        state$
      )
      const partyId = path(['value', 'user', 'data', 'partyId'], state$)
      const endpoint = `/search/sitesbypartyid?partyid=${partyId}&pg=1`

      const promise = httpGet(endpoint, null, access_token)

      return from(promise).pipe(
        map(response => {
          return response.status === 200
            ? siteActions.GET_SITES_SUCCESS(response.data)
            : siteActions.GET_SITES_ERROR(response)
        }),
        catchError(error => of(siteActions.GET_SITES_ERROR(error)))
      )
    })
  )
}
