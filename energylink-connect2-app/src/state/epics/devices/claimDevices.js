import { ofType } from 'redux-observable'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { path } from 'ramda'
import { getApiPVS } from 'shared/api'
import {
  CLAIM_DEVICES_INIT,
  CLAIM_DEVICES_SUCCESS,
  CLAIM_DEVICES_ERROR
} from 'state/actions/devices'

const claimDevicesEpic = action$ => {
  return action$.pipe(
    ofType(CLAIM_DEVICES_INIT.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'devices']))
        .then(api => api.startClaim({ id: 1 }, { requestBody: payload }))

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? CLAIM_DEVICES_SUCCESS(response)
            : CLAIM_DEVICES_ERROR('ERROR_EXECUTING_COMMAND')
        ),
        catchError(err => of(CLAIM_DEVICES_ERROR(err)))
      )
    })
  )
}

export default claimDevicesEpic
