import * as Sentry from '@sentry/browser'
import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import * as pvsActions from 'state/actions/pvs'
import { getApiPVS } from 'shared/api'

export const setMetaDataEpic = action$ => {
  return action$.pipe(
    ofType(pvsActions.SET_METADATA_INIT.getType()),
    switchMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'meta']))
        .then(api => api.setMetaData({ id: 1 }, { requestBody: payload }))

      return from(promise).pipe(
        map(({ status, data }) =>
          status === 200
            ? pvsActions.SET_METADATA_SUCCESS('success')
            : pvsActions.SET_METADATA_ERROR({ status, data })
        ),
        catchError(err => {
          Sentry.captureException(err)
          return of(pvsActions.SET_METADATA_ERROR(err))
        })
      )
    })
  )
}
