import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import {
  catchError,
  map,
  switchMap,
  takeUntil,
  exhaustMap
} from 'rxjs/operators'
import { path, cond, equals, always, isNil } from 'ramda'
import { getApiPVS, storageSwaggerTag } from 'shared/api'

import {
  POST_COMPONENT_MAPPING,
  POST_COMPONENT_MAPPING_SUCCESS,
  POST_COMPONENT_MAPPING_ERROR,
  GET_COMPONENT_MAPPING_COMPLETED,
  GET_COMPONENT_MAPPING_ERROR,
  GET_COMPONENT_MAPPING_PROGRESS
} from 'state/actions/storage'

export const postComponentMappingEpic = action$ => {
  return action$.pipe(
    ofType(POST_COMPONENT_MAPPING.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', storageSwaggerTag]))
        .then(api => api.startComponentMapping())

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? POST_COMPONENT_MAPPING_SUCCESS()
            : POST_COMPONENT_MAPPING_ERROR('COMPONENT_MAPPING_ERROR')
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(POST_COMPONENT_MAPPING_ERROR('COMPONENT_MAPPING_ERROR'))
        })
      )
    })
  )
}

export const getComponentMappingEpic = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(
      GET_COMPONENT_MAPPING_COMPLETED.getType(),
      GET_COMPONENT_MAPPING_ERROR.getType()
    )
  )
  return action$.pipe(
    ofType(POST_COMPONENT_MAPPING_SUCCESS.getType()),
    switchMap(() =>
      timer(0, 5000).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => {
          const promise = getApiPVS()
            .then(path(['apis', storageSwaggerTag]))
            .then(api => api.getComponentMapping())

          return from(promise).pipe(
            map(response => {
              /*
                response could be an empty object while the operation
                is still in progress, so we need to take that into account
              */
              const status = path(
                ['body', 'component_mapping_status'],
                response
              )

              const statusMatcher = cond([
                [
                  equals('FAILED'),
                  always(
                    GET_COMPONENT_MAPPING_ERROR({
                      payload: response.body,
                      error: 'COMPONENT_MAPPING_ERROR'
                    })
                  )
                ],
                [equals('NOT_RUNNING'), always(POST_COMPONENT_MAPPING())],
                [
                  equals('RUNNING'),
                  always(GET_COMPONENT_MAPPING_PROGRESS(response.body))
                ],
                [isNil, always(GET_COMPONENT_MAPPING_PROGRESS(response.body))],
                [
                  equals('SUCCEEDED'),
                  always(GET_COMPONENT_MAPPING_COMPLETED(response.body))
                ]
              ])
              return statusMatcher(status)
            }),
            catchError(err => {
              Sentry.captureException(err)
              return of(
                GET_COMPONENT_MAPPING_ERROR({
                  payload: '',
                  error: 'COMPONENT_MAPPING_ERROR'
                })
              )
            })
          )
        })
      )
    )
  )
}
