import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { translate } from 'shared/i18n'

import { submitGridProfile, submitMeterConfigurations } from './epicFunctions'

import {
  SUBMIT_PRECONFIG_GRIDPROFILE,
  SUBMIT_PRECONFIG_METER,
  SUBMIT_PRECONFIG_ERROR,
  SUBMIT_PRECONFIG_SUCCESS
} from 'state/actions/systemConfiguration'

export const submitPreConfigGridProfileEpic = (action$, state$) => {
  const t = translate(state$.value.language)

  return action$.pipe(
    ofType(SUBMIT_PRECONFIG_GRIDPROFILE.getType()),
    exhaustMap(({ payload }) => {
      if (!payload.gridProfile) {
        return of(SUBMIT_PRECONFIG_ERROR(t('SUBMIT_GRID_PROFILE_ERROR')))
      }

      return from(submitGridProfile(payload)).pipe(
        map(response => {
          return response.status === 200
            ? SUBMIT_PRECONFIG_METER(payload)
            : SUBMIT_PRECONFIG_ERROR(t('SUBMIT_GRID_PROFILE_ERROR'))
        }),
        catchError(err => {
          Sentry.addBreadcrumb({ message: t('SUBMIT_GRID_PROFILE_ERROR') })
          Sentry.captureException(err)
          return of(SUBMIT_PRECONFIG_ERROR(t('SUBMIT_GRID_PROFILE_ERROR')))
        })
      )
    })
  )
}

export const submitPreConfigMeterDataEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_PRECONFIG_METER.getType()),
    exhaustMap(({ payload }) => {
      if (!payload.metaData) {
        return of(SUBMIT_PRECONFIG_ERROR(t('SUBMIT_METER_DATA_ERROR')))
      }

      return from(submitMeterConfigurations(payload)).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_PRECONFIG_SUCCESS(response)
            : SUBMIT_PRECONFIG_ERROR(t('SUBMIT_METER_DATA_ERROR'))
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: t('SUBMIT_METER_DATA_ERROR') })
          Sentry.captureException(err)
          return of(SUBMIT_PRECONFIG_ERROR(t('SUBMIT_METER_DATA_ERROR')))
        })
      )
    })
  )
}
