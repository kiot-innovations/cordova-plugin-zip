import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { checkAllSSLCerts } from 'shared/sslCertCheck'
import {
  CHECK_SSL_CERTS,
  CHECK_SSL_CERTS_SUCCESS,
  CHECK_SSL_CERTS_ERROR,
} from 'state/actions/global'

import { SHOW_MODAL, HIDE_MODAL } from 'state/actions/modal'

export const checkSSLCertsEpic = (action$) => {
  return action$.pipe(
    ofType(CHECK_SSL_CERTS.getType()),
    exhaustMap(() => {
      return from(checkAllSSLCerts()).pipe(
        map(CHECK_SSL_CERTS_SUCCESS),
        catchError((err) => {
          Sentry.addBreadcrumb({ message: 'SSL Cert Failure' })
          Sentry.captureException(err)
          return of(CHECK_SSL_CERTS_ERROR(err))
        })
      )
    })
  )
}
//

export const checkSSLCertsErrorEpic = (action$) => {
  return action$.pipe(
    ofType(CHECK_SSL_CERTS_ERROR.getType()),
    map(({ payload }) =>
      SHOW_MODAL({
        title: 'SSL_CERT_CHECK_CONNECTION_NOT_SECURE_TITLE',
        componentPath: './SSLCertCheckConnectionNotSecure.jsx',
        componentProps: payload,
        dismissable: false,
      })
    )
  )
}

export const checkSSLCertsSuccessEpic = (action$) => {
  return action$.pipe(
    ofType(CHECK_SSL_CERTS_SUCCESS.getType()),
    map(() => HIDE_MODAL())
  )
}
