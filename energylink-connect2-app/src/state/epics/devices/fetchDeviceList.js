import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { FETCH_DEVICES_LIST, UPDATE_DEVICES_LIST } from 'state/actions/devices'
import { path } from 'ramda'

export const fetchDeviceListEpic = action$ => {
  return action$.pipe(
    ofType(FETCH_DEVICES_LIST.getType()),
    switchMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'devices']))
        .then(api => api.getDevices())

      return from(promise).pipe(
        map(response =>
          UPDATE_DEVICES_LIST(path(['body', 'devices'], response))
        )
      )
    })
  )
}
