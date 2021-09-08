import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, EMPTY } from 'rxjs'
import { map, exhaustMap, catchError } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { plainHttpGet } from 'shared/fetch'
import { getAppFlavor, getEnvironment } from 'shared/utils'
import {
  FETCH_STATUS_MESSAGES,
  SET_STATUS_MESSAGES
} from 'state/actions/global'

const appFlavor = getAppFlavor()
const STATUS_MESSAGE_URL = `https://sunpower-dev-cm2-config.s3-us-west-2.amazonaws.com/${appFlavor}/statusMessages.json`

export const fetchStatusMessagesEpic = action$ =>
  action$.pipe(
    ofType(FETCH_STATUS_MESSAGES.getType()),
    exhaustMap(() =>
      from(plainHttpGet(STATUS_MESSAGE_URL)).pipe(
        map(statusMessages =>
          SET_STATUS_MESSAGES(pathOr([], ['data', 'messages'], statusMessages))
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
          return EMPTY
        })
      )
    )
  )
