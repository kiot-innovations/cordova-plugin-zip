import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { from } from 'rxjs'
import {
  DOWNLOAD_SUPERUSER_FIRMWARE_LIST,
  DOWNLOAD_ESS_FIRMWARE_LIST_SUCCESS,
  DOWNLOAD_CM2_FIRMWARE_LIST_SUCCESS
} from 'state/actions/superuser'

export const getessUpdateList = async () => {
  try {
    const essUpdateListResponse = await fetch(
      process.env.REACT_APP_FW_DOWNLOAD_LIST_ESS_URL,
      {
        method: 'GET'
      }
    )
    const essUpdateListObject = await essUpdateListResponse.json()
    const essUpdateList = essUpdateListObject.message['sunvault-releases']
    return essUpdateList
  } catch (e) {
    Sentry.setTag('firmware', 'superuser.firmwareListEpic')
    Sentry.captureException(e)
    throw e
  }
}

export const getCM2UpdateList = async () => {
  const CM2UpdateListResponse = await fetch(
    process.env.REACT_APP_FW_DOWNLOAD_LIST_CM2_URL,
    {
      method: 'GET'
    }
  )
  const CM2UpdateListObject = await CM2UpdateListResponse.json()
  const CM2UpdateList = CM2UpdateListObject.message
  return CM2UpdateList
}

export const getessUpdateListEpic = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_SUPERUSER_FIRMWARE_LIST.getType()),
    mergeMap(() =>
      from(getessUpdateList()).pipe(
        map(response => DOWNLOAD_ESS_FIRMWARE_LIST_SUCCESS(response)),
        catchError(err => {
          Sentry.setTag('firmware', 'superuser.firmwareListEpic')
          Sentry.captureException(err)
        })
      )
    )
  )

export const getCM2UpdateListEpic = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_SUPERUSER_FIRMWARE_LIST.getType()),
    mergeMap(() =>
      from(getCM2UpdateList()).pipe(
        map(DOWNLOAD_CM2_FIRMWARE_LIST_SUCCESS),
        catchError(err => {
          Sentry.setTag('firmware', 'superuser.firmwareListEpic')
          Sentry.captureException(err)
        })
      )
    )
  )
