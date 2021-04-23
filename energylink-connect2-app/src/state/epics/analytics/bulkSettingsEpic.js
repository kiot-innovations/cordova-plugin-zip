import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { concatMap } from 'rxjs/operators'

import { trackConnectedDeviceFWUpdate } from 'shared/analytics'
import { getElapsedTimeWithState } from 'shared/analyticsUtils'
import { START_BULK_SETTINGS_TIMER } from 'state/actions/analytics'
import {
  TRIGGER_EQS_FIRMWARE_SUCCESS,
  UPDATE_EQS_FIRMWARE_COMPLETED,
  UPDATE_EQS_FIRMWARE_ERROR
} from 'state/actions/storage'

const startEssUpdateTracking = action$ =>
  action$.pipe(
    ofType(TRIGGER_EQS_FIRMWARE_SUCCESS.getType()),
    concatMap(({ payload }) => {
      return of(START_BULK_SETTINGS_TIMER())
    })
  )

const finishEssUpdateTracking = (action$, state$) =>
  action$.pipe(
    ofType(
      UPDATE_EQS_FIRMWARE_COMPLETED.getType(),
      UPDATE_EQS_FIRMWARE_ERROR.getType()
    ),
    concatMap(({ type }) => {
      const getTime = getElapsedTimeWithState(state$)
      return of(
        trackConnectedDeviceFWUpdate({
          'Success ': type === UPDATE_EQS_FIRMWARE_COMPLETED.getType(),
          $duration: getTime('bulkSettingsTimer')
        })
      )
    })
  )

export default [startEssUpdateTracking, finishEssUpdateTracking]
