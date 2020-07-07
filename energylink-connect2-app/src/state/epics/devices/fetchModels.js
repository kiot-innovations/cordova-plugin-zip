import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import {
  FETCH_MODELS_INIT,
  FETCH_MODELS_SUCCESS,
  FETCH_MODELS_ERROR,
  FETCH_MODELS_LOAD_DEFAULT
} from 'state/actions/devices'
import { pathOr, path, pluck, isEmpty } from 'ramda'
import { getApiDevice } from 'shared/api'

const getAccessToken = path(['user', 'auth', 'access_token'])
const getModelName = pluck('modelName')
const buildModelFilter = (type, models) => {
  return { type: type, models }
}

const defaultMIModelsByType = {
  E: [
    'SPR-E19-320-E-AC',
    'SPR-E20-327-E-AC',
    'SPR-E20-335-E-AC',
    'SPR-X20-327-BLK-E-AC',
    'SPR-X20-327-E-AC',
    'SPR-X21-335-BLK-E-AC',
    'SPR-X21-335-E-AC',
    'SPR-X21-345-E-AC',
    'SPR-X21-350-BLK-E-AC',
    'SPR-X22-360-E-AC',
    'SPR-X22-370-E-AC'
  ]
}

export const fetchModelsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(FETCH_MODELS_INIT.getType()),
    mergeMap(({ payload: MIType }) => {
      const promise = getApiDevice(getAccessToken(state$.value))
        .then(path(['apis', 'device']))
        .then(api =>
          api.deviceGetModuleModels({
            'mi-type': MIType
          })
        )

      return from(promise).pipe(
        map(moduleModels => {
          const models = pathOr([], ['body'], moduleModels)
          const nextAction = isEmpty(models)
            ? FETCH_MODELS_ERROR(MIType)
            : FETCH_MODELS_SUCCESS(
                buildModelFilter(MIType, getModelName(models))
              )

          return nextAction
        }),
        catchError(() => of(FETCH_MODELS_ERROR(MIType)))
      )
    })
  )
}

export const loadBackupModelsEpic = action$ => {
  return action$.pipe(
    ofType(FETCH_MODELS_ERROR.getType()),
    map(({ payload: MIType }) =>
      FETCH_MODELS_LOAD_DEFAULT(
        buildModelFilter(MIType, defaultMIModelsByType[MIType])
      )
    )
  )
}
