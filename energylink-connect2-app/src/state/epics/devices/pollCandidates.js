import { path, pathOr, length, includes } from 'ramda'
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

const validateCandidates = candidatesList => {
  if (length.candidatesList === 0) {
    return FETCH_CANDIDATES_ERROR('EMPTY_CANDIDATES')
  }

  const foundError = candidatesList.find(item =>
    includes('error', pathOr('error', ['STATEDESCR'], item).toLowerCase())
  )

  if (foundError) return FETCH_CANDIDATES_ERROR('CANDIDATES_ERROR_FOUND')

  return FETCH_CANDIDATES_UPDATE(candidatesList)
}

export const fetchCandidatesEpic = action$ => {
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

              return validateCandidates(candidatesList)
            }),
            catchError(error => of(FETCH_CANDIDATES_ERROR(error)))
          )
        })
      )
    )
  )
}
