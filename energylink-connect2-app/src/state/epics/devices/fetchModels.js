import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, switchMap, map } from 'rxjs/operators'
import {
  FETCH_MODELS_INIT,
  FETCH_MODELS_SUCCESS,
  FETCH_MODELS_ERROR
} from 'state/actions/devices'
import { pathOr } from 'ramda'

export const fetchModelsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(FETCH_MODELS_INIT.getType()),
    switchMap(() => {
      const authHeader = {
        Authorization: `Bearer ${state$.value.user.auth.access_token}`
      }

      const promise = fetch(
        'https://dev-edp-api.dev-edp.sunpower.com/v1/device/sunverge/modelnames',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          }
        }
      ).then(response => response.json())

      return from(promise).pipe(
        map(models => FETCH_MODELS_SUCCESS(pathOr([], ['items'], models))),
        catchError(err => of(FETCH_MODELS_ERROR(err)))
      )
    })
  )
}
