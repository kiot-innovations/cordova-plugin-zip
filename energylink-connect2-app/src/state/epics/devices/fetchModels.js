import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { FETCH_MODELS_INIT, FETCH_MODELS_SUCCESS } from 'state/actions/devices'
import { pathOr, path } from 'ramda'
import { getApiDevice } from 'shared/api'

const getAccessToken = path(['user', 'auth', 'access_token'])

const buildModelFilter = (type, data) => {
  return { type: type, models: data }
}

const cachedModels = {
  E: {
    items: [
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
}

export const fetchModelsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(FETCH_MODELS_INIT.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiDevice(getAccessToken(state$.value))
        .then(path(['apis', 'default']))
        .then(api =>
          api.get_v1_device__moduletype__modelnames({
            moduletype: payload
          })
        )

      return from(promise).pipe(
        map(models =>
          FETCH_MODELS_SUCCESS(
            buildModelFilter(payload, pathOr([], ['body', 'items'], models))
          )
        ),
        catchError(err => {
          Sentry.captureException(err)

          return of(
            FETCH_MODELS_SUCCESS(
              buildModelFilter(
                payload,
                pathOr([], [payload, 'items'], cachedModels)
              )
            )
          )
        })
      )
    })
  )
}
