import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import {
  FETCH_MODELS_ERROR,
  FETCH_MODELS_INIT,
  FETCH_MODELS_SUCCESS
} from 'state/actions/devices'
import { assoc, isEmpty, path, pathOr, propOr, reduce } from 'ramda'
import { getApiDevice } from 'shared/api'

const getAccessToken = path(['user', 'auth', 'access_token'])

const getAllMiModelsFromResponse = reduce((acc, elem) => {
  const { modelName, miType } = elem
  if (miType === null) return acc
  return assoc(miType, [...propOr([], miType, acc), modelName], acc)
}, {})

export const fetchModelsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(FETCH_MODELS_INIT.getType()),
    mergeMap(({ payload: MIType }) => {
      const promise = getApiDevice(getAccessToken(state$.value))
        .then(path(['apis', 'device']))
        .then(api => api.deviceGetModuleModels())

      return from(promise).pipe(
        map(moduleModels => {
          const models = pathOr([], ['body'], moduleModels)
          return isEmpty(models)
            ? FETCH_MODELS_ERROR(MIType)
            : FETCH_MODELS_SUCCESS(getAllMiModelsFromResponse(models))
        }),
        catchError(error => {
          Sentry.captureException(error)
          return of(FETCH_MODELS_ERROR(MIType))
        })
      )
    })
  )
}
