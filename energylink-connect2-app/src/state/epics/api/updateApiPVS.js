import { ofType } from 'redux-observable'
import { EMPTY, from } from 'rxjs'
import { catchError, exhaustMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'

export const upgradeApiPvsEpic = action$ =>
  action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    exhaustMap(() =>
      from(getApiPVS(true)).pipe(
        exhaustMap(() => EMPTY),
        catchError(err => {
          Sentry.captureException(err)
          return EMPTY
        })
      )
    )
  )
