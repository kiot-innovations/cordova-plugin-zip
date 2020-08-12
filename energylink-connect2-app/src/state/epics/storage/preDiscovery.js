import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { exhaustMap, map, catchError, delayWhen } from 'rxjs/operators'
import { path, prop, compose } from 'ramda'
import { getApiPVS, storageSwaggerTag } from 'shared/api'
import {
  GET_PREDISCOVERY,
  GET_PREDISCOVERY_SUCCESS,
  GET_PREDISCOVERY_ERROR,
  GET_DELAYED_PREDISCOVERY
} from 'state/actions/storage'
import { calculateTimeout } from 'shared/utils'

export const getPreDiscoveryEpic = action$ => {
  return action$.pipe(
    ofType(GET_PREDISCOVERY.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', storageSwaggerTag]))
        .then(api => api.getDeviceList())

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? GET_PREDISCOVERY_SUCCESS(response.body)
            : GET_PREDISCOVERY_ERROR('PREDISCOVERY_ERROR')
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(GET_PREDISCOVERY_ERROR('PREDISCOVERY_ERROR'))
        })
      )
    })
  )
}

export const getDelayedPreDiscoveryEpic = action$ => {
  return action$.pipe(
    ofType(GET_DELAYED_PREDISCOVERY.getType()),
    map(compose(calculateTimeout, prop('payload'))),
    delayWhen(timeout => timer(timeout)),
    map(GET_PREDISCOVERY())
  )
}
