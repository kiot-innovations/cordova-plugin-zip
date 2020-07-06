import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import {
  FETCH_MODELS_INIT,
  FETCH_MODELS_SUCCESS,
  FETCH_MODELS_ERROR
} from 'state/actions/devices'
import { pathOr, path, pluck } from 'ramda'
import { getApiDevice } from 'shared/api'

const getAccessToken = path(['user', 'auth', 'access_token'])

const buildModelFilter = (type, data) => {
  const getModelName = pluck('modelName')
  const models = getModelName(data)
  return { type: type, models }
}

export const fetchModelsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(FETCH_MODELS_INIT.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiDevice(getAccessToken(state$.value))
        .then(path(['apis', 'device']))
        .then(api =>
          api.deviceGetModuleModels({
            'mi-type': payload
          })
        )

      return from(promise).pipe(
        map(models =>
          FETCH_MODELS_SUCCESS(
            buildModelFilter(payload, pathOr([], ['body'], models))
          )
        ),
        catchError(error => of(FETCH_MODELS_ERROR(error)))
      )
    })
  )
}
