import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { catchError, map, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { OPEN_SETTINGS } from 'state/actions/network'
import { EMPTY_ACTION } from 'state/actions/share'

const openSettings = () =>
  new Promise((res, rej) =>
    window.cordova.plugins.diagnostic.switchToSettings(res, rej)
  )

export const openSettingsEpic = action$ => {
  return action$.pipe(
    ofType(OPEN_SETTINGS.getType()),
    exhaustMap(() =>
      from(openSettings()).pipe(
        map(EMPTY_ACTION),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'OPEN_APP_SETTINGS' })
          Sentry.captureException(err)
          return of(EMPTY_ACTION()) // TODO: Use an actionable ACTION
        })
      )
    )
  )
}
