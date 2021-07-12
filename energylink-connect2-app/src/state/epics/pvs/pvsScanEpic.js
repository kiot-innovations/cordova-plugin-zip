import * as Sentry from '@sentry/browser'
import { eqBy, prop, unionWith } from 'ramda'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'

import { b64toBlob } from '../../../shared/utils'

import { postBinary } from 'shared/fetch'
import * as pvsActions from 'state/actions/pvs'

export const pvsScanEpic = (action$, state$) => {
  let state
  state$.subscribe(s => {
    state = s
  })
  return action$.pipe(
    ofType(pvsActions.GET_SN_INIT.getType()),
    mergeMap(({ payload }) => {
      const photoBlob = b64toBlob(payload)
      const promise = postBinary(photoBlob).then(r => r.json())

      return from(promise).pipe(
        map(response => {
          return response.devices && response.devices.length > 0
            ? pvsActions.GET_SN_SUCCESS(
                unionWith(
                  eqBy(prop('serial_number')),
                  state.pvs.serialNumbers,
                  response.devices
                )
              )
            : pvsActions.GET_SN_ERROR('NOT_FOUND')
        }),
        catchError(err => {
          Sentry.captureException(err)
          return of(pvsActions.GET_SN_ERROR(err))
        })
      )
    })
  )
}
