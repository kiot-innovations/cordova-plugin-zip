import { ofType } from 'redux-observable'
import { iif, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { UpdateFeatureFlagsError } from 'shared/errors'
import {
  DELAY_BEFORE_UPDATE,
  featureFlagsUrl,
  getLastSuccessfulUpdate,
  getParsedFeatureFlags,
  getStatus,
  status
} from 'shared/featureFlags'
import { getElapsedTime } from 'shared/utils'
import { LOGIN_SUCCESS } from 'state/actions/auth'
import {
  UPDATE_FEATURE_FLAGS,
  UPDATE_FEATURE_FLAGS_ERROR
} from 'state/actions/feature-flags'
import { DEVICE_RESUME } from 'state/actions/mobile'

const { FETCHED, NEVER_FETCHED } = status

export const updateFeatureFlagsEpic = (action$, state$, { getJSON }) =>
  action$.pipe(
    ofType(LOGIN_SUCCESS.getType(), DEVICE_RESUME.getType()),
    switchMap(() =>
      iif(
        () =>
          getStatus(state$) === NEVER_FETCHED ||
          getElapsedTime(getLastSuccessfulUpdate(state$)) >=
            DELAY_BEFORE_UPDATE,
        getJSON(featureFlagsUrl, {
          'Cache-Control': 'private, no-store, no-cache, max-age=0'
        }).pipe(
          switchMap(response => {
            const featureFlags = getParsedFeatureFlags(response)
            const timestamp = Date.now()
            const status = FETCHED

            return of(
              UPDATE_FEATURE_FLAGS({
                featureFlags,
                timestamp,
                status
              })
            )
          }),
          catchError(({ message }) => {
            const error = new UpdateFeatureFlagsError(message)

            Sentry.setTag('endpoint', 'APP_FEATURE_FLAGS_URL')
            Sentry.captureException(error)
            return of(UPDATE_FEATURE_FLAGS_ERROR(error))
          })
        )
      )
    )
  )
