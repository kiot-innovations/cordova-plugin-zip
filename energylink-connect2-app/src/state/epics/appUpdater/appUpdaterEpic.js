import * as Sentry from '@sentry/browser'
import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { map, exhaustMap, catchError } from 'rxjs/operators'
import gt from 'semver/functions/gt'
import {
  CHECK_APP_UPDATE_INIT,
  CHECK_APP_UPDATE_SUCCESS,
  CHECK_APP_UPDATE_ERROR
} from 'state/actions/global'
import { plainHttpGet } from 'shared/fetch'
import { isIos, getAppFlavor, getEnvironment } from 'shared/utils'
import appVersion from '../../../macros/appVersion.macro'

//This version file looks like this from the S3 bucket defined
//{
//   "android": {
//     "build_number": "4.0.0"
//   },
//   "ios": {
//     "build_number": "4.0.0"
//   }
//}
const appFlavor = getAppFlavor()
const VERSION_URL = `https://sunpower-dev-cm2-config.s3-us-west-2.amazonaws.com/${appFlavor}/buildNumber.json`

export const appUpdaterEpic = action$ =>
  action$.pipe(
    ofType(CHECK_APP_UPDATE_INIT.getType()),
    exhaustMap(() =>
      from(plainHttpGet(VERSION_URL)).pipe(
        map(
          pathOr('0.0.0', ['data', isIos() ? 'ios' : 'android', 'build_number'])
        ),
        map(availableVersion =>
          gt(availableVersion, appVersion())
            ? CHECK_APP_UPDATE_SUCCESS(availableVersion)
            : CHECK_APP_UPDATE_ERROR()
        ),
        catchError(error => {
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
