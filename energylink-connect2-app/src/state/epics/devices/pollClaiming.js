import { path, pathOr, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import { TAGS } from 'shared/utils'
import {
  CLAIM_DEVICES_COMPLETE,
  CLAIM_DEVICES_ERROR,
  CLAIM_DEVICES_SUCCESS,
  CLAIM_DEVICES_UPDATE
} from 'state/actions/devices'

const updateClaimProgress = claimProgress => {
  const percent = prop('percent', claimProgress)
  const result = prop('result', claimProgress)
  const code = prop('code', claimProgress)

  if (percent === 100 && result === 'succeed')
    return CLAIM_DEVICES_COMPLETE(claimProgress)

  if (percent === 100 && result === 'error') {
    return CLAIM_DEVICES_ERROR(code)
  }

  return CLAIM_DEVICES_UPDATE(percent)
}

export const pollClaimingEpic = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(CLAIM_DEVICES_COMPLETE.getType(), CLAIM_DEVICES_ERROR.getType())
  )
  return action$.pipe(
    ofType(CLAIM_DEVICES_SUCCESS.getType()),
    switchMap(() =>
      timer(0, 2500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => {
          const promise = getApiPVS()
            .then(path(['apis', 'devices']))
            .then(api => api.getClaim())
          return from(promise).pipe(
            map(response => {
              const claimProgress = pathOr([], ['body'], response)
              return updateClaimProgress(claimProgress)
            }),
            catchError(error => {
              Sentry.setTag(TAGS.KEY.ENDPOINT, TAGS.VALUE.DEVICES_GET_CLAIM)
              Sentry.captureException(error)
              return of(CLAIM_DEVICES_ERROR(error))
            })
          )
        })
      )
    )
  )
}
