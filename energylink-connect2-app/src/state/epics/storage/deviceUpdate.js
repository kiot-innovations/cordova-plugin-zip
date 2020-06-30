import { ofType } from 'redux-observable'
import { path, pathOr, cond, always, equals } from 'ramda'
import { from, of, timer } from 'rxjs'
import { exhaustMap, map, catchError, takeUntil } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  UPLOAD_EQS_FIRMWARE,
  UPLOAD_EQS_FIRMWARE_SUCCESS,
  UPLOAD_EQS_FIRMWARE_ERROR,
  TRIGGER_EQS_FIRMWARE_SUCCESS,
  TRIGGER_EQS_FIRMWARE_ERROR,
  UPDATE_EQS_FIRMWARE_SUCCESS,
  UPDATE_EQS_FIRMWARE_ERROR,
  UPDATE_EQS_FIRMWARE_PROGRESS,
  UPDATE_EQS_FIRMWARE_COMPLETED
} from 'state/actions/storage'
import { storageSwaggerTag } from 'shared/api'
import * as Sentry from '@sentry/browser'

export const eqsUpdateErrors = {
  UPLOAD_EQS_FIRMWARE_ERROR: 'UPLOAD_EQS_FIRMWARE_ERROR',
  TRIGGER_EQS_FIRMWARE_ERROR: 'TRIGGER_EQS_FIRMWARE_ERROR'
}

export const uploadEqsFwEpic = action$ => {
  return action$.pipe(
    ofType(UPLOAD_EQS_FIRMWARE.getType()),
    exhaustMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', storageSwaggerTag]))
        .then(api => api.uploadFirmware({ id: 1 }, { requestBody: payload }))

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? UPLOAD_EQS_FIRMWARE_SUCCESS()
            : UPLOAD_EQS_FIRMWARE_ERROR(
                eqsUpdateErrors.UPLOAD_EQS_FIRMWARE_ERROR
              )
        ),
        catchError(err => {
          Sentry.captureException(new Error(err))
          return of(
            UPLOAD_EQS_FIRMWARE_ERROR(eqsUpdateErrors.UPLOAD_EQS_FIRMWARE_ERROR)
          )
        })
      )
    })
  )
}

export const triggerFwUpdateEpic = action$ => {
  return action$.pipe(
    ofType(UPLOAD_EQS_FIRMWARE_SUCCESS.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', storageSwaggerTag]))
        .then(api => api.updateFw({ id: 1 }, { requestBody: '' }))

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? TRIGGER_EQS_FIRMWARE_SUCCESS()
            : TRIGGER_EQS_FIRMWARE_ERROR(
                eqsUpdateErrors.TRIGGER_EQS_FIRMWARE_ERROR
              )
        ),
        catchError(err => {
          Sentry.captureException(new Error(err))
          return of(
            TRIGGER_EQS_FIRMWARE_ERROR(
              eqsUpdateErrors.TRIGGER_EQS_FIRMWARE_ERROR
            )
          )
        })
      )
    })
  )
}

export const pollFwUpdateEpic = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(
      UPDATE_EQS_FIRMWARE_SUCCESS.getType(),
      UPDATE_EQS_FIRMWARE_ERROR.getType()
    )
  )

  return action$.pipe(
    ofType(TRIGGER_EQS_FIRMWARE_SUCCESS.getType()),
    exhaustMap(() =>
      timer(0, 5000).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => {
          const promise = getApiPVS()
            .then(path(['apis', storageSwaggerTag]))
            .then(api => api.getFirmwareUpdateStatus())

          return from(promise).pipe(
            map(response => {
              const updateStatus = pathOr(
                'FAILED',
                ['body', 'firmware_update_status'],
                response
              )
              const matchStatus = cond([
                [
                  equals('FAILED'),
                  always(
                    UPDATE_EQS_FIRMWARE_ERROR({
                      error: eqsUpdateErrors.TRIGGER_EQS_FIRMWARE_ERROR,
                      response: response.body
                    })
                  )
                ],
                [equals('NOT_RUNNING'), always(UPLOAD_EQS_FIRMWARE_SUCCESS())],
                [
                  equals('RUNNING'),
                  always(UPDATE_EQS_FIRMWARE_PROGRESS(response.body))
                ],
                [
                  equals('COMPLETED'),
                  always(UPDATE_EQS_FIRMWARE_COMPLETED(response.body))
                ]
              ])
              return matchStatus(updateStatus)
            }),
            catchError(error =>
              of(
                UPDATE_EQS_FIRMWARE_ERROR({
                  error: eqsUpdateErrors.TRIGGER_EQS_FIRMWARE_ERROR,
                  response: {}
                })
              )
            )
          )
        })
      )
    )
  )
}
