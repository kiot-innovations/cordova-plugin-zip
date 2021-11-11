import * as Sentry from '@sentry/browser'
import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { map, catchError, exhaustMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { getEnvironment } from 'shared/utils'
import {
  GET_SYSTEM_CHECKS_INIT,
  SYSTEM_CHECKS_ERROR,
  SYSTEM_CHECKS_INIT
} from 'state/actions/systemChecks'

const promise = () =>
  getApiPVS()
    .then(path(['apis', 'commissioning']))
    .then(api =>
      api.runSystemHealthCheck(
        { id: 1 },
        { requestBody: { categories: ['ACPV'] } }
      )
    )

export const runSystemCheckEpic = action$ =>
  action$.pipe(
    ofType(SYSTEM_CHECKS_INIT.getType()),
    exhaustMap(() =>
      from(promise()).pipe(
        map(GET_SYSTEM_CHECKS_INIT),
        catchError(error => {
          Sentry.addBreadcrumb({
            data: {
              path: window.location.hash,
              environment: getEnvironment()
            },
            message: error.message,
            level: Sentry.Severity.Error
          })
          Sentry.captureException(error)
          return of(SYSTEM_CHECKS_ERROR())
        })
      )
    )
  )
