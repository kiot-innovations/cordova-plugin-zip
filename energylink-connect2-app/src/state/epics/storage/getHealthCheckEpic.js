import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { exhaustMap, map, catchError } from 'rxjs/operators'
import { path } from 'ramda'
import { getApiPVS, storageSwaggerTag } from 'shared/api'
import { START_DISCOVERY_ERROR, START_DISCOVERY_INIT } from 'state/actions/pvs'
import { DISCOVER_ERROR, DISCOVER_COMPLETE } from 'state/actions/devices'
import {
  GET_ESS_STATUS_INIT,
  GET_ESS_STATUS_SUCCESS,
  GET_ESS_STATUS_ERROR,
  RUN_EQS_SYSTEMCHECK_SUCCESS
} from 'state/actions/storage'
import { RUN_EQS_SYSTEMCHECK } from 'state/actions/storage'

export const startHealthCheckEpic = action$ => {
  return action$.pipe(
    ofType(GET_ESS_STATUS_INIT.getType()),
    exhaustMap(() => {
      return of(START_DISCOVERY_INIT({ Device: 'allnomi' }))
    })
  )
}

export const waitHealthCheckEpic = action$ => {
  return action$.pipe(
    ofType(DISCOVER_COMPLETE.getType()),
    exhaustMap(() => {
      return of(RUN_EQS_SYSTEMCHECK())
    })
  )
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

export const getHealthCheckEpic = action$ => {
  return action$.pipe(
    ofType(RUN_EQS_SYSTEMCHECK_SUCCESS.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', storageSwaggerTag]))
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

export const errorHealthCheckEpic = action$ => {
  return action$.pipe(
    ofType(START_DISCOVERY_ERROR.getType(), DISCOVER_ERROR.getType()),
    exhaustMap(() => {
      return of(GET_ESS_STATUS_ERROR('ESS_STATUS_ERROR'))
    })
  )
}
