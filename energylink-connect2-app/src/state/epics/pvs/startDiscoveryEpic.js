import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import * as pvsActions from 'state/actions/pvs'

export const startDiscoveryEpic = action$ =>
  action$.pipe(
    ofType(pvsActions.START_DISCOVERY_INIT.getType()),
    mergeMap(() => {
      const promise = fetch(
        process.env.REACT_APP_PVS_SELECTEDADDRESS + '/dl_cgi/discovery',
        {
          method: 'post',
          body: JSON.stringify({ Device: 'allnomi' })
        }
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
