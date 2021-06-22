import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, map, retryWhen, switchMap } from 'rxjs/operators'
import { pathOr } from 'ramda'
import authClient from 'shared/auth/sdk'
import * as authActions from 'state/actions/auth'
import { translate } from 'shared/i18n'
import genericRetryStrategy from 'shared/rxjs/genericRetryStrategy'

export const refreshTokenEpic = (action$, state$) => {
  const t = translate()
  let retries = 0

  return action$.pipe(
    ofType(authActions.REFRESH_TOKEN_INIT.getType()),
    switchMap(() => {
      const { refresh_token } = pathOr({}, ['user', 'auth'], state$.value)
      return from(authClient.refreshTokenOAuth(refresh_token)).pipe(
        map(response => {
          if (response.error) {
            retries = retries + 1

            if (retries > 2) {
              retries = 0
              return authActions.LOGOUT()
            }
            return authActions.REFRESH_TOKEN_INIT(refresh_token)
          }
          return authActions.REFRESH_TOKEN_SUCCESS(response)
        }),
        retryWhen(
          genericRetryStrategy({
            maxRetryAttempts: 3
          })
        ),
        catchError(err => {
          Sentry.addBreadcrumb({
            data: {
              path: window.location.hash,
              environment: process.env.REACT_APP_FLAVOR
            },
            category: t('REFRESH_TOKEN'),
            message: err.message,
            level: Sentry.Severity.Error
          })
          Sentry.captureException(err)

          return of(authActions.LOGOUT())
        })
      )
    })
  )
}
