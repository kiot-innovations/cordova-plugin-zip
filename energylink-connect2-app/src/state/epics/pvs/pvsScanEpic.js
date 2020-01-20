import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import * as pvsActions from 'state/actions/pvs'
import { postBinary } from 'shared/fetch'

function mergeSN(arr1, arr2) {
  if (arr1.length > 0) {
    const ids = new Set(arr1.map(d => d.serial_number))
    const merged = [...arr1, ...arr2.filter(d => !ids.has(d.serial_number))]
    return merged
  } else {
    return arr2
  }
}

export const pvsScanEpic = (action$, state$) => {
  let state
  state$.subscribe(s => {
    state = s
  })
  return action$.pipe(
    ofType(pvsActions.GET_SN_INIT.getType()),
    mergeMap(({ payload }) => {
      const promise = fetch(payload)
        .then(res => res.blob())
        .then(postBinary)
        .then(r => r.json())

      return from(promise).pipe(
        map(response => {
          return response.devices && response.devices.length > 0
            ? pvsActions.GET_SN_SUCCESS(
                mergeSN(state.pvs.serialNumbers, response.devices)
              )
            : pvsActions.GET_SN_ERROR('NOT_FOUND')
        }),
        catchError(err => of(pvsActions.GET_SN_ERROR(err)))
      )
    })
  )
}
