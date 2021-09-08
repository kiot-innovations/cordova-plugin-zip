import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { checkAllSSLCerts } from 'shared/sslCertCheck'
import {
  CHECK_SSL_CERTS,
  CHECK_SSL_CERTS_SUCCESS,
  CHECK_SSL_CERTS_ERROR
} from 'state/actions/global'

export const checkSSLCertsEpic = action$ => {
  return action$.pipe(
    ofType(CHECK_SSL_CERTS.getType()),
    exhaustMap(() => {
      return from(checkAllSSLCerts()).pipe(
        map(CHECK_SSL_CERTS_SUCCESS),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'SSL Cert Failure' })
          Sentry.captureException(err)
          Sentry.withScope(function(scope) {
            Sentry.setTag('security', 'Failed SSL Certificate Check')
            scope.setLevel(Sentry.Severity.Warning)
            Sentry.captureMessage(JSON.stringify(err.payload), {})
          })
          return of(CHECK_SSL_CERTS_ERROR(err))
        })
      )
    })
  )
}
