import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import {
  compose,
  filter,
  map as rmap,
  path,
  pathOr,
  prop,
  propEq,
  propSatisfies,
  test
} from 'ramda'

import {
  SAVE_CT_RATED_CURRENT_ERROR,
  SAVE_CT_RATED_CURRENT_INIT,
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_ERROR,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_EXPORTLIMIT,
  SUBMIT_GRIDPROFILE,
  SUBMIT_METERCONFIG
} from 'state/actions/systemConfiguration'
import { EMPTY_ACTION } from 'state/actions/share'

const setCtRatedCurrent = ({ ratedCurrent, devices }) =>
  devices.reduce(async (prevPromise, nextDevice) => {
    await prevPromise
    return getApiPVS()
      .then(path(['apis', 'meter']))
      .then(api =>
        api.setMeterParameters(
          { id: 1 },
          {
            requestBody: {
              Device: nextDevice,
              ctRatedCurrent: ratedCurrent
            }
          }
        )
      )
  }, Promise.resolve())

const getRatedCurrent = path([
  'value',
  'systemConfiguration',
  'meter',
  'ratedCurrent'
])
const getCTDevices = compose(
  filter(Boolean),
  rmap(prop('SERIAL')),
  filter(propSatisfies(test(/-METER-C$/), 'TYPE')),
  filter(propEq('DEVICE_TYPE', 'Power Meter')),
  pathOr([], ['value', 'devices', 'found'])
)

export const submitGridVoltageEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    exhaustMap(({ payload }) => {
      if (!payload.gridVoltage) {
        return of(SAVE_CT_RATED_CURRENT_INIT(payload))
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
            ? SAVE_CT_RATED_CURRENT_INIT(payload)
            : SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_VOLTAGE_ERROR'))
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: t('SUBMIT_GRID_VOLTAGE_ERROR') })
          Sentry.captureException(err)
          return of(SUBMIT_CONFIG_ERROR(t('SUBMIT_GRID_VOLTAGE_ERROR')))
        })
      )
    })
  )
}

export const submitCTRatedCurrentEpic = (action$, state$) =>
  action$.pipe(
    ofType(SAVE_CT_RATED_CURRENT_INIT.getType()),
    exhaustMap(({ payload }) =>
      from(
        setCtRatedCurrent({
          devices: getCTDevices(state$),
          ratedCurrent: getRatedCurrent(state$)
        })
      ).pipe(
        map(() => SUBMIT_GRIDPROFILE(payload)),
        catchError(err => {
          Sentry.captureException(err)
          return of(SAVE_CT_RATED_CURRENT_ERROR(err))
        })
      )
    )
  )

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
                lazy: payload.gridVoltage === 240 ? 1 : 0
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
          Sentry.addBreadcrumb({ message: t('SUBMIT_GRID_PROFILE_ERROR') })
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
            ? SUBMIT_METERCONFIG(payload)
            : SUBMIT_CONFIG_ERROR(t('SUBMIT_EXPORT_LIMIT_ERROR'))
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: t('SUBMIT_EXPORT_LIMIT_ERROR') })
          Sentry.captureException(err)
          return of(SUBMIT_CONFIG_ERROR(t('SUBMIT_EXPORT_LIMIT_ERROR')))
        })
      )
    })
  )
}

export const submitMeterDataEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_METERCONFIG.getType()),
    exhaustMap(({ payload }) => {
      if (!payload.metaData) {
        return of(
          payload.singleConfig
            ? SUBMIT_CONFIG_ERROR(t('SUBMIT_METER_DATA_ERROR'))
            : SUBMIT_CONFIG_SUCCESS(payload)
        )
      }

      const promise = getApiPVS()
        .then(path(['apis', 'meta']))
        .then(api =>
          api.setMetaData({ id: 1 }, { requestBody: payload.metaData })
        )

      return from(promise).pipe(
        map(response => {
          if (response.status === 200) {
            return payload.singleConfig
              ? EMPTY_ACTION()
              : SUBMIT_CONFIG_SUCCESS(response)
          } else {
            return SUBMIT_CONFIG_ERROR(t('SUBMIT_METER_DATA_ERROR'))
          }
        }),
        catchError(err => {
          Sentry.addBreadcrumb({ message: t('SUBMIT_METER_DATA_ERROR') })
          Sentry.captureException(err)
          return of(SUBMIT_CONFIG_ERROR(t('SUBMIT_METER_DATA_ERROR')))
        })
      )
    })
  )
}
