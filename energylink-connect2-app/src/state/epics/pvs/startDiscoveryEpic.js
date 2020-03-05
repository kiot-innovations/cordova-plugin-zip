import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { path } from 'ramda'
import * as pvsActions from 'state/actions/pvs'
import { getApiPVS } from 'shared/api'

export const startDiscoveryEpic = action$ =>
  action$.pipe(
    ofType(pvsActions.START_DISCOVERY_INIT.getType()),
    mergeMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'discovery']))
        .then(api =>
          api.discover({ id: 1 }, { requestBody: { Device: 'allnomi' } })
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? pvsActions.START_DISCOVERY_SUCCESS(response)
            : pvsActions.START_DISCOVERY_ERROR('SEND_COMMAND_ERROR')
        ),
        catchError(err => of(pvsActions.START_DISCOVERY_ERROR(err)))
      )
    })
  )
