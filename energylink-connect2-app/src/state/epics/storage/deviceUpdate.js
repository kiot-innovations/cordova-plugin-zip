import * as Sentry from '@sentry/browser'
import { always, cond, equals, path, pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, exhaustMap, map, takeUntil } from 'rxjs/operators'

import { getApiPVS, storageSwaggerTag } from 'shared/api'
import { fileExists, getFileBlob } from 'shared/fileSystem'
import {
  CHECK_EQS_FIRMWARE,
  GETFILE_EQS_FIRMWARE,
  TRIGGER_EQS_FIRMWARE_ERROR,
  TRIGGER_EQS_FIRMWARE_SUCCESS,
  UPDATE_EQS_FIRMWARE_COMPLETED,
  UPDATE_EQS_FIRMWARE_ERROR,
  UPDATE_EQS_FIRMWARE_PROGRESS,
  UPLOAD_EQS_FIRMWARE,
  UPLOAD_EQS_FIRMWARE_ERROR,
  UPLOAD_EQS_FIRMWARE_PROGRESS,
  TRIGGER_EQS_FIRMWARE_UPDATE_INIT
} from 'state/actions/storage'
import uploaderObservable from 'state/epics/observables/uploader'

export const eqsUpdateStates = {
  FAILED: 'FAILED',
  NOT_RUNNING: 'NOT_RUNNING',
  RUNNING: 'RUNNING',
  SUCCEEDED: 'SUCCEEDED'
}

export const eqsUpdateErrors = {
  CHECKFILE_EQS_FIRMWARE_ERROR: 'CHECKFILE_EQS_FIRMWARE_ERROR',
  GETFILE_EQS_FIRMWARE_ERROR: 'GETFILE_EQS_FIRMWARE_ERROR',
  UPLOAD_EQS_FIRMWARE_ERROR: 'UPLOAD_EQS_FIRMWARE_ERROR',
  TRIGGER_EQS_FIRMWARE_ERROR: 'TRIGGER_EQS_FIRMWARE_ERROR'
}

const getFwPackagePath = path(['value', 'ess', 'filePath'])

export const checkEqsFwFile = (action$, state$) =>
  action$.pipe(
    ofType(CHECK_EQS_FIRMWARE.getType()),
    exhaustMap(() =>
      from(fileExists(getFwPackagePath(state$))).pipe(
        map(GETFILE_EQS_FIRMWARE),
        catchError(err => {
          Sentry.captureException(err)
          return of(
            UPLOAD_EQS_FIRMWARE_ERROR(
              eqsUpdateErrors.CHECKFILE_EQS_FIRMWARE_ERROR
            )
          )
        })
      )
    )
  )

export const getEqsFwFile = (action$, state$) =>
  action$.pipe(
    ofType(GETFILE_EQS_FIRMWARE.getType()),
    exhaustMap(() =>
      from(getFileBlob(getFwPackagePath(state$))).pipe(
        map(UPLOAD_EQS_FIRMWARE),
        catchError(err => {
          Sentry.captureException(err)

          return of(
            UPLOAD_EQS_FIRMWARE_ERROR(
              eqsUpdateErrors.GETFILE_EQS_FIRMWARE_ERROR
            )
          )
        })
      )
    )
  )

export const uploadEqsFwEpic = action$ => {
  return action$.pipe(
    ofType(UPLOAD_EQS_FIRMWARE.getType()),
    exhaustMap(({ payload }) =>
      uploaderObservable({
        url: 'http://sunpowerconsole.com/cgi-bin/upload-ess-firmware',
        file: payload
      }).pipe(
        map(response =>
          response.message === 'UPLOAD_COMPLETE'
            ? TRIGGER_EQS_FIRMWARE_UPDATE_INIT()
            : UPLOAD_EQS_FIRMWARE_PROGRESS(response)
        ),
        catchError(err => {
          Sentry.captureException(new Error(err))
          return of(
            UPLOAD_EQS_FIRMWARE_ERROR(eqsUpdateErrors.UPLOAD_EQS_FIRMWARE_ERROR)
          )
        })
      )
    )
  )
}

export const triggerFwUpdateEpic = action$ => {
  return action$.pipe(
    ofType(TRIGGER_EQS_FIRMWARE_UPDATE_INIT.getType()),
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
      UPDATE_EQS_FIRMWARE_COMPLETED.getType(),
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
                eqsUpdateStates.FAILED,
                ['body', 'firmware_update_status'],
                response
              )
              const matchStatus = cond([
                [
                  equals(eqsUpdateStates.FAILED),
                  always(
                    UPDATE_EQS_FIRMWARE_ERROR({
                      error: eqsUpdateErrors.TRIGGER_EQS_FIRMWARE_ERROR,
                      response: response.body
                    })
                  )
                ],
                [
                  equals(eqsUpdateStates.NOT_RUNNING),
                  always(
                    UPDATE_EQS_FIRMWARE_ERROR({
                      error: eqsUpdateErrors.TRIGGER_EQS_FIRMWARE_ERROR,
                      response: response.body
                    })
                  )
                ],
                [
                  equals(eqsUpdateStates.RUNNING),
                  always(UPDATE_EQS_FIRMWARE_PROGRESS(response.body))
                ],
                [
                  equals(eqsUpdateStates.SUCCEEDED),
                  always(UPDATE_EQS_FIRMWARE_COMPLETED(response.body))
                ]
              ])
              return matchStatus(updateStatus)
            }),
            catchError(err => {
              Sentry.captureException(new Error(err))
              return of(
                UPDATE_EQS_FIRMWARE_ERROR({
                  error: eqsUpdateErrors.TRIGGER_EQS_FIRMWARE_ERROR,
                  response: {}
                })
              )
            })
          )
        })
      )
    )
  )
}
