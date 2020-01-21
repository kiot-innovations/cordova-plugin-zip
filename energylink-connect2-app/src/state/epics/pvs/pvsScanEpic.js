import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import * as pvsActions from 'state/actions/pvs'
import { postBinary } from 'shared/fetch'
import { b64toBlob } from '../../../shared/utils'

export const pvsScanEpic = action$ =>
  action$.pipe(
    ofType(pvsActions.GET_SN_INIT.getType()),
    mergeMap(({ payload }) => {
      const photoBlob = b64toBlob(payload)
      const promise = postBinary(photoBlob).then(r => r.json())

      return from(promise).pipe(
        map(response => {
          console.info(response)
          return response.devices && response.devices.length > 0
            ? pvsActions.GET_SN_SUCCESS(response.devices)
            : pvsActions.GET_SN_ERROR('NOT_FOUND')
        }),
        catchError(err => of(pvsActions.GET_SN_ERROR(err)))
      )
    })
  )
