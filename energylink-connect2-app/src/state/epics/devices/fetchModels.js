import { isEmpty, path, pathOr, propOr, reduceBy } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiDevice } from 'shared/api'
import {
  FETCH_MODELS_ERROR,
  FETCH_MODELS_INIT,
  FETCH_MODELS_SUCCESS
} from 'state/actions/devices'

const getAccessToken = path(['user', 'auth', 'access_token'])

const getModel = (acc, { modelName }) => acc.concat(modelName)

const groupByType = reduceBy(getModel, [], propOr('stringInverters', 'miType'))

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
            : FETCH_MODELS_SUCCESS(groupByType(models))
        }),
        catchError(error => {
          Sentry.captureException(error)
          return of(FETCH_MODELS_ERROR(MIType))
        })
      )
    })
  )
}
