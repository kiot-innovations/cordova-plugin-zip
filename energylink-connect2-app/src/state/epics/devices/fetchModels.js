import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, switchMap, map } from 'rxjs/operators'
import {
  FETCH_MODELS_INIT,
  FETCH_MODELS_SUCCESS,
  FETCH_MODELS_ERROR
} from 'state/actions/devices'
import { pathOr } from 'ramda'
import { httpGet } from 'shared/fetch'

const buildModelFilter = (type, data) => {
  return { type: type, models: data }
}

export const fetchModelsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(FETCH_MODELS_INIT.getType()),
    switchMap(({ payload }) => {
      const promise = httpGet(`/device/${payload}/modelnames`, state$.value)
      return from(promise).pipe(
        map(models =>
          FETCH_MODELS_SUCCESS(
            buildModelFilter(payload, pathOr([], ['data', 'items'], models))
          )
        ),
        catchError(err => of(FETCH_MODELS_ERROR(err)))
      )
    })
  )
}
