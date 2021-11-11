import * as Sentry from '@sentry/browser'
import {
  all,
  compose,
  includes,
  isEmpty,
  path,
  pluck,
  prop,
  propOr
} from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import {
  map,
  catchError,
  switchMap,
  takeUntil,
  exhaustMap
} from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { getEnvironment } from 'shared/utils'
import {
  GET_SYSTEM_CHECKS_ERROR,
  GET_SYSTEM_CHECKS_INIT,
  GET_SYSTEM_CHECKS_SUCCESS,
  GET_SYSTEM_CHECKS_UPDATE
} from 'state/actions/systemChecks'

const promise = () =>
  getApiPVS()
    .then(path(['apis', 'commissioning']))
    .then(api => api.getSystemHealthReport())

export const getSystemCheckEpic = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(
      GET_SYSTEM_CHECKS_ERROR.getType(),
      GET_SYSTEM_CHECKS_SUCCESS.getType()
    )
  )
  return action$.pipe(
    ofType(GET_SYSTEM_CHECKS_INIT.getType()),
    exhaustMap(() =>
      timer(0, 2500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => {
          return from(promise()).pipe(
            map(prop('body')),
            switchMap(body => {
              const getChecksStatus = compose(
                pluck('status'),
                propOr([], 'checks')
              )
              const checksStatus = getChecksStatus(body)

              if (isEmpty(checksStatus)) return of(GET_SYSTEM_CHECKS_ERROR())

              const finishStatus = status =>
                includes(status, ['FAILED', 'SUCCEEDED', 'UNSUPPORTED'])

              const areChecksFinished = all(finishStatus)(checksStatus)

              return of(
                areChecksFinished
                  ? GET_SYSTEM_CHECKS_SUCCESS(body)
                  : GET_SYSTEM_CHECKS_UPDATE(body)
              )
            }),
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
              return of(GET_SYSTEM_CHECKS_ERROR())
            })
          )
        })
      )
    )
  )
}
