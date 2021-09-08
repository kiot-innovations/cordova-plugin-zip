import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, switchMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import {
  CHECK_TRACKING_PERMISSION,
  REQUEST_TRACKING_PERMISSION,
  SET_TRACKING_PERMISSION
} from 'state/actions/permissions'
import { trackingPermissionValues } from 'state/reducers/permissions'

export const checkTrackingPermissionsEpic = action$ => {
  return action$.pipe(
    ofType(CHECK_TRACKING_PERMISSION.getType()),
    exhaustMap(() =>
      from(window.cordova.plugins.idfa.getInfo()).pipe(
        switchMap(permissionState => {
          if (
            permissionState.trackingPermission !==
            trackingPermissionValues.TRACKING_PERMISSION_AUTHORIZED
          ) {
            return of(
              SET_TRACKING_PERMISSION(permissionState.trackingPermission),
              REQUEST_TRACKING_PERMISSION()
            )
          } else {
            return of(
              SET_TRACKING_PERMISSION(permissionState.trackingPermission)
            )
          }
        }),
        catchError(err => {
          Sentry.captureException(err)
        })
      )
    )
  )
}
