import { path, pathOr, length } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, switchMap, takeUntil } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  FETCH_CANDIDATES_UPDATE,
  FETCH_CANDIDATES_COMPLETE,
  FETCH_CANDIDATES_ERROR,
  PUSH_CANDIDATES_SUCCESS
} from 'state/actions/devices'

const fetchCandidatesEpic = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(
      FETCH_CANDIDATES_COMPLETE.getType(),
      FETCH_CANDIDATES_ERROR.getType()
    )
  )
  return action$.pipe(
    ofType(PUSH_CANDIDATES_SUCCESS.getType()),
    switchMap(() =>
      timer(0, 5000).pipe(
        takeUntil(stopPolling$),
        switchMap(() => {
          const promise = getApiPVS()
            .then(path(['apis', 'candidates']))
            .then(api => api.getCandidates())
          return from(promise).pipe(
            switchMap(async response => {
              const candidatesList = pathOr(
                [],
                ['body', 'candidates'],
                response
              )
              return length(candidatesList) > 0
                ? FETCH_CANDIDATES_UPDATE(candidatesList)
                : FETCH_CANDIDATES_ERROR('No candidates received')
            }),
            catchError(error => of(FETCH_CANDIDATES_ERROR(error)))
          )
        })
      )
    )
  )
}

export default fetchCandidatesEpic
