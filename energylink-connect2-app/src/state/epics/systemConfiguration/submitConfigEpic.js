import * as Sentry from '@sentry/browser'
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
  SUBMIT_GRIDVOLTAGE,
  SUBMIT_GRIDPROFILE
} from 'state/actions/systemConfiguration'

export const submitMeterDataEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    exhaustMap(({ payload }) => {
      if (!payload.metaData) {
        return of(SUBMIT_GRIDVOLTAGE(payload))
      }

      const promise = getApiPVS()
        .then(path(['apis', 'meta']))
        .then(api =>
          api.setMetaData({ id: 1 }, { requestBody: payload.metaData })
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_GRIDVOLTAGE(payload)
            : SUBMIT_CONFIG_ERROR(t('SUBMIT_METER_DATA_ERROR'))
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'Submit config' })
          Sentry.captureException(err)
          return of(SUBMIT_CONFIG_ERROR(t('SUBMIT_METER_DATA_ERROR')))
        })
      )
    })
  )
}

export const submitGridProfileEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_GRIDPROFILE.getType()),
    exhaustMap(({ payload }) => {
      if (!payload.gridProfile) {
        return of(SUBMIT_EXPORTLIMIT(payload))
      }

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
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'Submit grid profile' })
          Sentry.captureException(err)
          return of(SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_PROFILE_ERROR')))
        })
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
            ? SUBMIT_CONFIG_SUCCESS(response)
            : SUBMIT_CONFIG_ERROR(t('SUBMIT_EXPORT_LIMIT_ERROR'))
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'Submit export limit' })
          Sentry.captureException(err)
          return of(SUBMIT_CONFIG_ERROR(t('SUBMIT_EXPORT_LIMIT_ERROR')))
        })
      )
    })
  )
}

export const submitGridVoltageEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_GRIDVOLTAGE.getType()),
    exhaustMap(({ payload }) => {
      if (!payload.gridVoltage) {
        return of(SUBMIT_GRIDPROFILE())
      }

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
            ? SUBMIT_GRIDPROFILE(payload)
            : SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_VOLTAGE_ERROR'))
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'Submit grid voltage' })
          Sentry.captureException(err)
          return of(SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_VOLTAGE_ERROR')))
        })
      )
    })
  )
}
