import { getApiPVS } from 'shared/api'
import {
  CLAIM_DEVICES_SUCCESS,
  CLAIM_DEVICES_UPDATE,
  CLAIM_DEVICES_COMPLETE,
  CLAIM_DEVICES_ERROR
} from 'state/actions/devices'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, switchMap, takeUntil } from 'rxjs/operators'
import { prop, path, pathOr } from 'ramda'

const updateClaimProgress = claimProgress => {
  const percent = prop('percent', claimProgress)
  const result = prop('result', claimProgress)

  if (percent === 100 && result === 'succeed')
    return CLAIM_DEVICES_COMPLETE(claimProgress)

  return CLAIM_DEVICES_UPDATE(percent)
}

export const pollClaimingEpic = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(CLAIM_DEVICES_COMPLETE.getType(), CLAIM_DEVICES_ERROR.getType())
  )
  return action$.pipe(
    ofType(CLAIM_DEVICES_SUCCESS.getType()),
    switchMap(() =>
      timer(0, 1000).pipe(
        takeUntil(stopPolling$),
        switchMap(() => {
          const promise = getApiPVS()
            .then(path(['apis', 'devices']))
            .then(api => api.getClaim())
          return from(promise).pipe(
            switchMap(async response => {
              const claimProgress = pathOr([], ['body'], response)
              return updateClaimProgress(claimProgress)
            }),
            catchError(error => of(CLAIM_DEVICES_ERROR(error)))
          )
        })
      )
    )
  )
}
