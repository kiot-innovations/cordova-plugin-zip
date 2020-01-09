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

      console.info(state$.value)
      console.info(partyId)

      // const promise = getApiParty(access_token)
      //   .then(path(['apis', 'default']))
      //   .then(api => api.get_v2_party__partyId__site({ partyId }))

      const promise = httpGet(endpoint, null, access_token)

      return from(promise).pipe(
        map(response => {
          console.info(response, 'response')
          return response.status === 200
            ? siteActions.GET_SITES_SUCCESS(response.data)
            : siteActions.GET_SITES_ERROR(response)
        }),
        catchError(error => {
          console.error(error, 'DARK')
          return of(siteActions.GET_SITES_ERROR(error))
        })
      )
    })
  )
} /* from(httpGet(endpoint, null, access_token)).pipe(
        map(({ status, data }) => {
          console.log(status)
          console.log(data)

          return status === 200
            ? siteActions.GET_SITES_SUCCESS(data)
            : siteActions.GET_SITES_ERROR({ status, data })
        }),
        catchError(err => of(siteActions.GET_SITES_ERROR(err)))
      )
    }) */
/* from(getApiParty(access_token)).pipe(
        map(client => {
          console.log(client, 'THE CLIENT')
          const api = path(['apis', 'default'], client)
        }))

       */
