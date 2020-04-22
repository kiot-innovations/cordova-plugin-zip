import { ofType } from 'redux-observable'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { path } from 'ramda'
import { from, of } from 'rxjs'
import { getApiPVS } from 'shared/api'
import {
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_COMMISSION_ERROR
} from 'state/actions/systemConfiguration'

export const submitConfigObjectEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG_SUCCESS.getType()),
    mergeMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'commission']))
        .then(api => api.sendConfig({ id: 1 }, { requestBody: {} }))

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_COMMISSION_SUCCESS(response)
            : SUBMIT_COMMISSION_ERROR(response.result)
        ),
        catchError(response => of(SUBMIT_COMMISSION_ERROR(response)))
      )
    })
  )
}
