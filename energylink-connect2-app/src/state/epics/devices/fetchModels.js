import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import {
  FETCH_MODELS_ERROR,
  FETCH_MODELS_INIT,
  FETCH_MODELS_LOAD_DEFAULT,
  FETCH_MODELS_SUCCESS
} from 'state/actions/devices'
import { assoc, isEmpty, path, pathOr, propOr, reduce } from 'ramda'
import { getApiDevice } from 'shared/api'

const getAccessToken = path(['user', 'auth', 'access_token'])

const defaultMIModelsByType = {
  C: [
    'SPR-E19-320-C-AC',
    'SPR-E20-327-C-AC',
    'SPR-X21-335-BLK-C-AC',
    'SPR-X21-335-C-AC',
    'SPR-X21-345-C-AC',
    'SPR-X22-360-C-AC'
  ],
  D: [
    'SPR-E20-327-D-AC',
    'SPR-X19-315-D-AC',
    'SPR-X20-327-BLK-D-AC',
    'SPR-X20-327-D-AC',
    'SPR-X21-335-BLK-D-AC',
    'SPR-X21-335-D-AC',
    'SPR-X21-345-D-AC',
    'SPR-X21-350-BLK-D-AC',
    'SPR-X22-360-D-AC',
    'SPR-X22-370-D-AC'
  ],
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
  ],
  G: [
    'SPR-A390-G-AC',
    'SPR-A400-G-AC',
    'SPR-A410-G-AC',
    'SPR-A415-G-AC',
    'SPR-A420-G-AC',
    'SPR-A390-BLK-G-AC',
    'SPR-A400-BLK-G-AC'
  ],
  H: [
    'SPR-A390-H-AC',
    'SPR-A400-H-AC',
    'SPR-A410-H-AC',
    'SPR-A415-H-AC',
    'SPR-A420-H-AC',
    'SPR-A390-BLK-H-AC',
    'SPR-A400-BLK-H-AC'
  ]
}
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

export const loadBackupModelsEpic = action$ => {
  return action$.pipe(
    ofType(FETCH_MODELS_ERROR.getType()),
    map(() => FETCH_MODELS_LOAD_DEFAULT(defaultMIModelsByType))
  )
}
