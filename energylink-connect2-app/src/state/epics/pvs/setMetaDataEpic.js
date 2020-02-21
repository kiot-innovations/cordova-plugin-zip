import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import * as pvsActions from 'state/actions/pvs'
import { getApiPVS } from 'shared/api'

export const setMetaDataEpic = action$ => {
  return action$.pipe(
    ofType(pvsActions.SET_METADATA_INIT.getType()),
    switchMap(({ payload: siteKey }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'meta']))
        .then(api => api.setMetaData({ site_key: siteKey }))

      return from(promise).pipe(
        map(({ status, data }) =>
          status === 200
            ? pvsActions.SET_METADATA_SUCCESS(data)
            : pvsActions.SET_METADATA_ERROR({ status, data })
        ),
        catchError(err => of(pvsActions.SET_METADATA_ERROR(err)))
      )
    })
  )
}
