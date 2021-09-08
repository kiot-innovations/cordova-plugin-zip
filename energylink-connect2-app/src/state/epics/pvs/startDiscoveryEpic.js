import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, switchMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import * as pvsActions from 'state/actions/pvs'

const startDiscovery = payload =>
  getApiPVS()
    .then(path(['apis', 'discovery']))
    .then(api => api.discover({ id: 1 }, { requestBody: payload }))

export const startDiscoveryEpic = action$ =>
  action$.pipe(
    ofType(pvsActions.START_DISCOVERY_INIT.getType()),
    exhaustMap(({ payload }) =>
      from(startDiscovery(payload)).pipe(
        switchMap(response => {
          return response.status === 200
            ? of(pvsActions.START_DISCOVERY_SUCCESS(response))
            : of(pvsActions.START_DISCOVERY_ERROR('SEND_COMMAND_ERROR'))
        }),
        catchError(err => {
          Sentry.captureException(err)
          return of(pvsActions.START_DISCOVERY_ERROR(err))
        })
      )
    )
  )
