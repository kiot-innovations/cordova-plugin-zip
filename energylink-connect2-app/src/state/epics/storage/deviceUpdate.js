import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { always, cond, equals, path, pathOr } from 'ramda'
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
  UPLOAD_EQS_FIRMWARE_SUCCESS
} from 'state/actions/storage'
import { PERSIST_DATA_PATH } from 'shared/utils'

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

const fwPackagePath = 'ESS/EQS-FW-Package.zip'

export const checkEqsFwFile = action$ => {
  return action$.pipe(
    ofType(CHECK_EQS_FIRMWARE.getType()),
    exhaustMap(() =>
      from(fileExists(`${PERSIST_DATA_PATH}${fwPackagePath}`)).pipe(
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
}

export const getEqsFwFile = action$ => {
  return action$.pipe(
    ofType(GETFILE_EQS_FIRMWARE.getType()),
    exhaustMap(() =>
      from(getFileBlob(fwPackagePath)).pipe(
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
}

export const uploadEqsFwEpic = action$ => {
  return action$.pipe(
    ofType(UPLOAD_EQS_FIRMWARE.getType()),
    exhaustMap(({ payload }) => {
      const formdata = new FormData()
      formdata.append('firmware', payload, 'ChiefHopper.zip')

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      }

      const promise = fetch(
        'http://sunpowerconsole.com/cgi-bin/upload-ess-firmware',
        requestOptions
      )

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
