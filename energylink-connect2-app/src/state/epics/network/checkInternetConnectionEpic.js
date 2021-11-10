import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import { hasInternetConnection } from 'shared/utils'
import { SET_TUTORIAL } from 'state/actions/knowledgeBase'
import { SET_INTERNET_CONNECTION } from 'state/actions/network'

export const checkInternetConnection = action$ =>
  action$.pipe(
    ofType(SET_TUTORIAL.getType()),
    exhaustMap(({ payload }) => {
      return from(hasInternetConnection()).pipe(
        map(() => SET_INTERNET_CONNECTION(true)),
        catchError(err => {
          return of(SET_INTERNET_CONNECTION(false))
        })
      )
    })
  )
