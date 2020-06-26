import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { exhaustMap, map, catchError } from 'rxjs/operators'
import { path } from 'ramda'
import {
  GET_ESS_STATUS_INIT,
  GET_ESS_STATUS_SUCCESS,
  GET_ESS_STATUS_ERROR
} from 'state/actions/storage'

import { getApiPVS } from 'shared/api'

export const getHealthCheckEpic = action$ => {
  return action$.pipe(
    ofType(GET_ESS_STATUS_INIT.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'Commissioning']))
        .then(api => api.getEssStatus())

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? GET_ESS_STATUS_SUCCESS(response.body)
            : GET_ESS_STATUS_ERROR('ESS_STATUS_ERROR')
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(GET_ESS_STATUS_ERROR(error))
        })
      )
    })
  )
}
