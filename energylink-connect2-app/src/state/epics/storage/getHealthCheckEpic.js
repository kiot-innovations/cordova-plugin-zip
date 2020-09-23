import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { exhaustMap, map, catchError } from 'rxjs/operators'
import { compose, lensPath, multiply, over, path, pathOr } from 'ramda'
import { getApiPVS, storageSwaggerTag } from 'shared/api'
import { START_DISCOVERY_ERROR, START_DISCOVERY_INIT } from 'state/actions/pvs'
import { DISCOVER_COMPLETE, DISCOVER_ERROR } from 'state/actions/devices'
import {
  GET_ESS_STATUS_ERROR,
  GET_ESS_STATUS_INIT,
  GET_ESS_STATUS_SUCCESS,
  RUN_EQS_SYSTEMCHECK,
  RUN_EQS_SYSTEMCHECK_SUCCESS
} from 'state/actions/storage'
import { roundDecimals } from 'shared/rounding'
import { discoveryTypes } from 'state/reducers/devices'

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

const updateSoc = over(
  lensPath(['ess_report', 'battery_status']),
  map(
    over(
      lensPath(['state_of_charge', 'value']),
      compose(roundDecimals, multiply(100))
    )
  )
)

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
            ? GET_ESS_STATUS_SUCCESS(updateSoc(response.body))
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
