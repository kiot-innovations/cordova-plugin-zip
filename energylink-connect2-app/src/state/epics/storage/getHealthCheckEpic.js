import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { exhaustMap, map, catchError } from 'rxjs/operators'
import { path, pathOr } from 'ramda'
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
import { EMPTY_ACTION } from 'state/actions/share'
import { discoveryTypes } from 'state/reducers/devices'
import { eqsSteps } from 'state/reducers/storage'

export const startHealthCheckEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_ESS_STATUS_INIT.getType()),
    map(() => {
      const lastDiscovery = pathOr(
        '',
        ['value', 'pvs', 'lastDiscoveryType'],
        state$
      )
      return lastDiscovery === discoveryTypes.LEGACY
        ? RUN_EQS_SYSTEMCHECK()
        : START_DISCOVERY_INIT({
            Device: 'allnomi',
            type: discoveryTypes.LEGACY
          })
    })
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
