import * as Sentry from '@sentry/browser'
import { path, propOr, contains } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import { plainHttpGet } from 'shared/fetch'
import * as scanditActions from 'state/actions/scandit'

const getPartyId = path(['user', 'data', 'partyId'])

export const limitScanditAccessEpic = (action$, state$) => {
  return action$.pipe(
    ofType(scanditActions.GET_SCANDIT_USERS.getType()),
    exhaustMap(() =>
      from(plainHttpGet(process.env.REACT_APP_SCANDIT_USERS)).pipe(
        map(({ status, data }) => {
          const userPartyId = getPartyId(state$.value)
          const allowedPartyIds = propOr('', 'party_ids', data)
          const isAllowed = contains(userPartyId, allowedPartyIds)
          return status === 200
            ? scanditActions.SET_SCANDIT_ACCESS(true || isAllowed)
            : scanditActions.SET_SCANDIT_ACCESS(true)
        }),
        catchError(error => {
          Sentry.captureException(error)
          return of(scanditActions.SET_SCANDIT_ACCESS(true))
        })
      )
    )
  )
}
