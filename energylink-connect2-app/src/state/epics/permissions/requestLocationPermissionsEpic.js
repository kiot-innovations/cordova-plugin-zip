import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, exhaustMap } from 'rxjs/operators'

import { requestLocationPermissions } from 'shared/permissionsChecker'
import {
  CHECK_LOCATION_PERMISSION_ERROR,
  CHECK_LOCATION_PERMISSION_INIT,
  REQUEST_LOCATION_PERMISSION_INIT
} from 'state/actions/permissions'

export const requestLocationPermissionsEpic = action$ => {
  return action$.pipe(
    ofType(REQUEST_LOCATION_PERMISSION_INIT.getType()),
    exhaustMap(() =>
      from(requestLocationPermissions()).pipe(
        map(CHECK_LOCATION_PERMISSION_INIT),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'REQUEST_LOCATION_PERMISSION_INIT' })
          Sentry.captureException(err)
          return of(CHECK_LOCATION_PERMISSION_ERROR(err))
        })
      )
    )
  )
}
