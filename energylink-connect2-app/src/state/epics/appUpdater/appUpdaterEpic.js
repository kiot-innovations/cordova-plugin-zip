import * as Sentry from '@sentry/browser'
import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { map, exhaustMap, catchError } from 'rxjs/operators'
import {
  CHECK_APP_UPDATE_INIT,
  CHECK_APP_UPDATE_SUCCESS,
  CHECK_APP_UPDATE_ERROR
} from 'state/actions/global'
import { plainHttpGet } from 'shared/fetch'
import { getEnvironment } from 'shared/utils'
import appVersion from '../../../macros/appVersion.macro'

const VERSION_URL =
  'https://spwr-config.s3-us-west-2.amazonaws.com/buildNumber.json'

export const appUpdaterEpic = action$ =>
  action$.pipe(
    ofType(CHECK_APP_UPDATE_INIT.getType()),
    exhaustMap(() =>
      from(plainHttpGet(VERSION_URL)).pipe(
        map(pathOr(-1, ['data', 'build_number'])),
        map(availableVersion =>
          availableVersion > appVersion()
            ? CHECK_APP_UPDATE_SUCCESS(availableVersion)
            : CHECK_APP_UPDATE_ERROR()
        ),
        catchError(error => {
          console.error(error)

          Sentry.addBreadcrumb({
            data: {
              path: window.location.hash,
              environment: getEnvironment()
            },
            message: error.message,
            level: Sentry.Severity.Warning
          })
          Sentry.captureException(error)
          return of(CHECK_APP_UPDATE_ERROR())
        })
      )
    )
  )
