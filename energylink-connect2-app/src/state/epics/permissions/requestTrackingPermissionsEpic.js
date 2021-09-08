import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import {
  REQUEST_TRACKING_PERMISSION,
  SET_TRACKING_PERMISSION
} from 'state/actions/permissions'

export const requestTrackingPermissionsEpic = action$ => {
  return action$.pipe(
    ofType(REQUEST_TRACKING_PERMISSION.getType()),
    exhaustMap(() =>
      from(window.cordova.plugins.idfa.requestPermission()).pipe(
        map(result => {
          return SET_TRACKING_PERMISSION(result)
        }),
        catchError(err => {
          Sentry.captureException(err)
        })
      )
    )
  )
}
