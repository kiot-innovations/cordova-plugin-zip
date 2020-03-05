import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { path } from 'ramda'
import * as pvsActions from 'state/actions/pvs'
import { getApiPVS } from 'shared/api'

export const startCommissioningEpic = action$ =>
  action$.pipe(
    ofType(pvsActions.START_COMMISSIONING_INIT.getType()),
    mergeMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'commissioning']))
        .then(api => api.startCommissioning())

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? pvsActions.START_COMMISSIONING_SUCCESS(response) // { result: "succeed", supervisor: {...} }
            : pvsActions.START_COMMISSIONING_ERROR('SEND_COMMAND_ERROR')
        ),
        catchError(err => of(pvsActions.START_COMMISSIONING_ERROR(err)))
      )
    })
  )
