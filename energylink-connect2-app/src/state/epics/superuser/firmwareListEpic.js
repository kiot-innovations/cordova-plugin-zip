import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { from } from 'rxjs'
import {
  DOWNLOAD_ESS_FIRMWARE_LIST,
  DOWNLOAD_ESS_FIRMWARE_LIST_SUCCESS
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
    Sentry.captureException(e)
    throw e
  }
}

export const getessUpdateListEpic = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_ESS_FIRMWARE_LIST.getType()),
    mergeMap(() =>
      from(getessUpdateList()).pipe(
        map(response => DOWNLOAD_ESS_FIRMWARE_LIST_SUCCESS(response)),
        catchError(err => {
          Sentry.captureException(err)
        })
      )
    )
  )
