import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, map, switchMap, timeout } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import authClient from 'shared/auth/sdk'
import { translate } from 'shared/i18n'
import { TAGS } from 'shared/utils'
import * as authActions from 'state/actions/auth'

export const refreshTokenEpic = (action$, state$) => {
  const t = translate()
  return action$.pipe(
    ofType(authActions.REFRESH_TOKEN_INIT.getType()),
    switchMap(() => {
      const { refresh_token } = pathOr({}, ['user', 'auth'], state$.value)
      return from(authClient.refreshTokenOAuth(refresh_token)).pipe(
        timeout(3000),
        map(response =>
          response.error
            ? authActions.LOGOUT()
            : authActions.REFRESH_TOKEN_SUCCESS(response)
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
          Sentry.setTag(TAGS.KEY.LOGIN, TAGS.VALUE.REFRESH_TOKEN)
          Sentry.captureException(err)
          console.info({ err })
          return of(authActions.LOGOUT())
        })
      )
    })
  )
}
