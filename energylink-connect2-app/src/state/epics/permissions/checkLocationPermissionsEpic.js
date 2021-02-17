import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import {
  CHECK_LOCATION_PERMISSION_SUCCESS,
  CHECK_LOCATION_PERMISSION_ERROR,
  CHECK_LOCATION_PERMISSION_INIT
} from 'state/actions/permissions'
import { checkLocationPermissions } from 'shared/permissionsChecker'
import { LOCATION_PERMISSIONS } from 'state/reducers/permissions'
import { SHOW_MODAL, HIDE_MODAL } from 'state/actions/modal'
import { translate } from 'shared/i18n'
import { DEVICE_RESUME } from 'state/actions/mobile'

export const checkLocationPermissionsEpic = action$ => {
  return action$.pipe(
    ofType(CHECK_LOCATION_PERMISSION_INIT.getType(), DEVICE_RESUME.getType()),
    exhaustMap(() =>
      from(checkLocationPermissions()).pipe(
        map(CHECK_LOCATION_PERMISSION_SUCCESS),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'CHECK_LOCATION_PERMISSION_INIT' })
          Sentry.captureException(err)
          return of(CHECK_LOCATION_PERMISSION_ERROR(err))
        })
      )
    )
  )
}

const accessNotGranted = perm =>
  perm === LOCATION_PERMISSIONS.NOT_REQUESTED ||
  perm === LOCATION_PERMISSIONS.DENIED_ONCE ||
  perm === LOCATION_PERMISSIONS.DENIED_ALWAYS

export const showLocationPermissionModalEpic = (action$, state$) => {
  const t = translate()
  return action$.pipe(
    ofType(CHECK_LOCATION_PERMISSION_SUCCESS.getType()),
    map(({ payload: locationPermission }) =>
      accessNotGranted(locationPermission) &&
      !state$.value.permissions.modalOpened
        ? SHOW_MODAL({
            title: t('LOCATION_TITLE'),
            componentPath: './AskForLocationPermissionModal.jsx'
          })
        : HIDE_MODAL()
    )
  )
}
