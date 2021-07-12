import * as Sentry from '@sentry/browser'
import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import {
  CLAIM_DEVICES_INIT,
  CLAIM_DEVICES_SUCCESS,
  CLAIM_DEVICES_ERROR
} from 'state/actions/devices'

export const claimDevicesEpic = action$ => {
  return action$.pipe(
    ofType(CLAIM_DEVICES_INIT.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'devices']))
        .then(api => api.startClaim({ id: 1 }, { requestBody: payload }))

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? CLAIM_DEVICES_SUCCESS(response)
            : CLAIM_DEVICES_ERROR('ERROR_EXECUTING_COMMAND')
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'Claim devices init' })
          Sentry.captureException(err)
          return of(CLAIM_DEVICES_ERROR(err))
        })
      )
    })
  )
}
