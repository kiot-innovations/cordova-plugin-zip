import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, switchMap } from 'rxjs/operators'
import { path } from 'ramda'
import { DISCOVER_INIT } from 'state/actions/devices'
import * as pvsActions from 'state/actions/pvs'
import { getApiPVS } from 'shared/api'

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
            ? of(DISCOVER_INIT(), pvsActions.START_DISCOVERY_SUCCESS(response))
            : of(pvsActions.START_DISCOVERY_ERROR('SEND_COMMAND_ERROR'))
        }),
        catchError(err => {
          Sentry.captureException(err)
          return of(pvsActions.START_DISCOVERY_ERROR(err))
        })
      )
    )
  )
