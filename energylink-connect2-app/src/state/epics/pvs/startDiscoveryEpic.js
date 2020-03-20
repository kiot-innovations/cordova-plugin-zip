import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { path } from 'ramda'
import * as pvsActions from 'state/actions/pvs'
import { getApiPVS } from 'shared/api'
import { FIRMWARE_UPDATE_COMPLETE } from 'state/actions/firmwareUpdate'

export const startDiscoveryEpic = action$ =>
  action$.pipe(
    ofType(
      pvsActions.START_DISCOVERY_INIT.getType(),
      FIRMWARE_UPDATE_COMPLETE.getType()
    ),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'discovery']))
        .then(api =>
          api.discover(
            { id: 1 },
            { requestBody: { Device: 'allnomi', Interfaces: ['mime'] } }
          )
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
