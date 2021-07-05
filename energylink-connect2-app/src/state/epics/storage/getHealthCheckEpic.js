import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import {
  exhaustMap,
  map,
  catchError,
  switchMap,
  takeUntil
} from 'rxjs/operators'
import { always, cond, equals, isNil, path, pathOr } from 'ramda'
import { getApiPVS, storageSwaggerTag } from 'shared/api'
import { START_DISCOVERY_ERROR, START_DISCOVERY_INIT } from 'state/actions/pvs'
import { DISCOVER_COMPLETE, DISCOVER_ERROR } from 'state/actions/devices'
import {
  GET_ESS_STATUS_COMPLETE,
  GET_ESS_STATUS_ERROR,
  GET_ESS_STATUS_INIT,
  GET_ESS_STATUS_SUCCESS,
  GET_ESS_STATUS_UPDATE,
  GET_ESS_STATUS,
  SET_ESS_STATUS,
  SET_ESS_STATUS_ERROR,
  RUN_EQS_SYSTEMCHECK,
  RUN_EQS_SYSTEMCHECK_SUCCESS
} from 'state/actions/storage'
import { EMPTY_ACTION } from 'state/actions/share'
import { discoveryTypes } from 'state/reducers/devices'
import { eqsSteps } from 'state/reducers/storage'

export const startHealthCheckEpic = action$ => {
  return action$.pipe(
    ofType(GET_ESS_STATUS_INIT.getType()),
    map(() =>
      START_DISCOVERY_INIT({
        Device: 'storage',
        type: discoveryTypes.STORAGE
      })
    )
  )
}

export const waitHealthCheckEpic = (action$, state$) => {
  return action$.pipe(
    ofType(DISCOVER_COMPLETE.getType()),
    map(() => {
      const currentStep = pathOr(
        '',
        ['value', 'storage', 'currentStep'],
        state$
      )
      return currentStep === eqsSteps.HEALTH_CHECK
        ? RUN_EQS_SYSTEMCHECK()
        : EMPTY_ACTION()
    })
  )
}

const errorObj = {
  response: {
    body: { result: 'ESS_STATUS_ERROR' }
  }
}

export const runSystemCheckEpic = action$ => {
  return action$.pipe(
    ofType(RUN_EQS_SYSTEMCHECK.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', storageSwaggerTag]))
        .then(api => api.runSystemHealthCheck())

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? RUN_EQS_SYSTEMCHECK_SUCCESS()
            : GET_ESS_STATUS_ERROR(errorObj)
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(GET_ESS_STATUS_ERROR(errorObj))
        })
      )
    })
  )
}

export const getHealthCheckEpic = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(GET_ESS_STATUS_SUCCESS.getType(), GET_ESS_STATUS_ERROR.getType())
  )

  return action$.pipe(
    ofType(RUN_EQS_SYSTEMCHECK_SUCCESS.getType()),
    switchMap(() =>
      timer(0, 2500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => {
          const promise = getApiPVS()
            .then(path(['apis', storageSwaggerTag]))
            .then(api => api.getSystemHealthReport())

          return from(promise).pipe(
            map(response => {
              const status = pathOr(
                false,
                ['body', 'equinox_system_check_status'],
                response
              )

              const statusMatcher = cond([
                [equals('FAILED'), always(GET_ESS_STATUS_ERROR(errorObj))],
                [equals('NOT_RUNNING'), always(GET_ESS_STATUS_ERROR(errorObj))],
                [equals('RUNNING'), always(GET_ESS_STATUS_UPDATE())],
                [isNil, always(GET_ESS_STATUS_ERROR(errorObj))],
                [equals('SUCCEEDED'), always(GET_ESS_STATUS_SUCCESS())]
              ])

              return statusMatcher(status)
            }),
            catchError(error => {
              Sentry.setTag('endpoint', 'storage.status')
              Sentry.addBreadcrumb({
                message:
                  'Failure while polling /dl_cgi/equinox-system-check/status'
              })
              Sentry.captureMessage(
                'getHealthCheckEpic - getSingleStorageStatusEpic'
              )
              return of(GET_ESS_STATUS_ERROR(errorObj))
            })
          )
        })
      )
    )
  )
}

export const retrieveStorageStatusEpic = action$ =>
  action$.pipe(
    ofType(GET_ESS_STATUS_SUCCESS.getType()),
    switchMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', storageSwaggerTag]))
        .then(api => api.getEssStatus())

      return from(promise).pipe(
        map(response => GET_ESS_STATUS_COMPLETE(response.body)),
        catchError(error => {
          Sentry.addBreadcrumb({
            message:
              'Failure while calling /dl_cgi/energy-storage-system/status'
          })
          Sentry.captureException(error)
          return of(GET_ESS_STATUS_ERROR(errorObj))
        })
      )
    })
  )

export const getSingleStorageStatusEpic = action$ =>
  action$.pipe(
    ofType(GET_ESS_STATUS.getType()),
    switchMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', storageSwaggerTag]))
        .then(api => api.getEssStatus())

      return from(promise).pipe(
        map(response => SET_ESS_STATUS(response.body)),
        catchError(error => {
          Sentry.addBreadcrumb({
            message:
              'Failure while calling /dl_cgi/energy-storage-system/status'
          })
          Sentry.captureException(error)
          return of(SET_ESS_STATUS_ERROR(errorObj.response.body))
        })
      )
    })
  )

export const errorHealthCheckEpic = action$ => {
  return action$.pipe(
    ofType(START_DISCOVERY_ERROR.getType(), DISCOVER_ERROR.getType()),
    exhaustMap(() => {
      return of(GET_ESS_STATUS_ERROR(errorObj))
    })
  )
}
