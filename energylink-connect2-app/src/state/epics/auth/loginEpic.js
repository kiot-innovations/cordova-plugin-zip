import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { httpPost } from 'shared/fetch'
import * as authActions from 'state/actions/auth'

export const loginEpic = action$ =>
  action$.pipe(
    ofType(authActions.LOGIN_INIT.getType()),
    mergeMap(({ payload }) =>
      from(httpPost('/autenticate', payload)).pipe(
        map(({ status, data }) =>
          status === 200
            ? authActions.LOGIN_SUCCESS(data)
            : authActions.LOGIN_ERROR({ status, data })
        ),
        catchError(err => of(authActions.LOGIN_ERROR(err)))
      )
    )
  )
