import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import authClient from 'shared/auth/sdk'
import * as authActions from 'state/actions/auth'

export const refreshTokenEpic = action$ => {
  let retries = 0
  return action$.pipe(
    ofType(authActions.REFRESH_TOKEN_INIT.getType()),
    mergeMap(({ payload }) => {
      return from(authClient.refreshTokenOAuth(payload)).pipe(
        map(authActions.REFRESH_TOKEN_SUCCESS),
        catchError(err => {
          retries = retries + 1

          if (retries >= 2) {
            retries = 0
            return of(authActions.LOGOUT())
          }

          return of(authActions.REFRESH_TOKEN_INIT(payload))
        })
      )
    })
  )
}
