import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { path, propOr } from 'ramda'
import * as pvsActions from 'state/actions/pvs'
import { getApiPVS } from 'shared/api'

export const startDiscoveryEpic = action$ =>
  action$.pipe(
    ofType(pvsActions.START_DISCOVERY_INIT.getType()),
    exhaustMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'discovery']))
        .then(api => api.discover({ id: 1 }, { requestBody: payload }))

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? pvsActions.START_DISCOVERY_SUCCESS(
                propOr(
                  {
                    dldiscovery: 'started',
                    mimediscovery: 'notstarted',
                    result: 'succeed'
                  },
                  'body',
                  response
                )
              )
            : pvsActions.START_DISCOVERY_ERROR('SEND_COMMAND_ERROR')
        ),
        catchError(err => {
          Sentry.captureException(err)
          return of(pvsActions.START_DISCOVERY_ERROR(err))
        })
      )
    })
  )
