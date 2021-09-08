import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { translate } from 'shared/i18n'
import { checkLocationPermissions } from 'shared/permissionsChecker'
import { DEVICE_RESUME } from 'state/actions/mobile'
import { SHOW_MODAL, HIDE_MODAL } from 'state/actions/modal'
import {
  CHECK_LOCATION_PERMISSION_SUCCESS,
  CHECK_LOCATION_PERMISSION_ERROR,
  CHECK_LOCATION_PERMISSION_INIT
} from 'state/actions/permissions'
import { EMPTY_ACTION } from 'state/actions/share'
import { LOCATION_PERMISSIONS } from 'state/reducers/permissions'

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
    map(({ payload: locationPermission }) => {
      if (accessNotGranted(locationPermission)) {
        if (!state$.value.permissions.modalOpened) {
          return SHOW_MODAL({
            title: t('LOCATION_TITLE'),
            componentPath: './AskForLocationPermissionModal.jsx'
          })
        } else {
          return EMPTY_ACTION()
        }
      } else {
        if (
          state$.value.modal.show === true &&
          state$.value.modal.title === t('LOCATION_TITLE')
        ) {
          return HIDE_MODAL()
        }
        return EMPTY_ACTION()
      }
    })
  )
}
