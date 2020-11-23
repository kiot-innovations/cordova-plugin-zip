import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { path, pathOr, propOr } from 'ramda'
import { from, of } from 'rxjs'
import { getApiPVS } from 'shared/api'
import {
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_COMMISSION_ERROR
} from 'state/actions/systemConfiguration'

export const submitConfigObjectEpic = (action$, state$) => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG_SUCCESS.getType()),
    mergeMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'commission']))
        .then(api => api.sendConfig({ id: 1 }, { requestBody: {} }))

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_COMMISSION_SUCCESS(response)
            : SUBMIT_COMMISSION_ERROR('')
        ),
        catchError(error => {
          const pvsSn = state$.value.pvs.serialNumber
          const data = pathOr({}, ['response', 'body', 'result'], error)

          Sentry.addBreadcrumb({
            data: {
              pvsSerialNumber: pvsSn,
              code: propOr('', 'code', data),
              message: propOr('Unknown error.', 'message', data),
              exception: propOr('', 'exception', data)
            },
            message: 'Commissioning error.',
            type: 'error',
            category: 'error',
            level: 'error'
          })
          Sentry.captureException(error)
          return of(SUBMIT_COMMISSION_ERROR(''))
        })
      )
    })
  )
}
