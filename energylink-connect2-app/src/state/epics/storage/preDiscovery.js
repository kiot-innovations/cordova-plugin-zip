import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { exhaustMap, map, catchError } from 'rxjs/operators'
import { path } from 'ramda'
import { getApiPVS, storageSwaggerTag } from 'shared/api'
import {
  GET_PREDISCOVERY,
  GET_PREDISCOVERY_SUCCESS,
  GET_PREDISCOVERY_ERROR
} from 'state/actions/storage'

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
