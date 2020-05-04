import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import { path } from 'ramda'
import {
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR,
  SUBMIT_EXPORTLIMIT,
  SUBMIT_GRIDVOLTAGE
} from 'state/actions/systemConfiguration'

export const submitGridProfileEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    exhaustMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.set(
            { id: 1 },
            {
              requestBody: {
                ID: payload.gridProfile,
                lazy: payload.lazyGridProfile
              }
            }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_EXPORTLIMIT(payload)
            : SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_PROFILE_ERROR'))
        ),
        catchError(err =>
          of(SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_PROFILE_ERROR')))
        )
      )
    })
  )
}

export const submitExportLimitEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_EXPORTLIMIT.getType()),
    exhaustMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.setGridExportLimit(
            { id: 1 },
            { requestBody: { Limit: payload.exportLimit } }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_GRIDVOLTAGE(payload)
            : SUBMIT_CONFIG_ERROR(t('SUBMIT_EXPORT_LIMIT_ERROR'))
        ),
        catchError(err =>
          of(SUBMIT_CONFIG_ERROR(t('SUBMIT_EXPORT_LIMIT_ERROR')))
        )
      )
    })
  )
}

export const submitGridVoltageEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_GRIDVOLTAGE.getType()),
    exhaustMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.setGridVoltage(
            { id: 1 },
            { requestBody: { body: { grid_voltage: payload.gridVoltage } } }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_CONFIG_SUCCESS(response)
            : SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_VOLTAGE_ERROR'))
        ),
        catchError(err =>
          of(SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_VOLTAGE_ERROR')))
        )
      )
    })
  )
}
