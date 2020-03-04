import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { path, prop, uniqBy } from 'ramda'
import {
  GET_NETWORK_APS_INIT,
  GET_NETWORK_APS_SUCCESS,
  GET_NETWORK_APS_ERROR
} from 'state/actions/systemConfiguration'
import { getApiPVS } from 'shared/api'

const filterDuplicateAPs = uniqBy(prop('ssid'))

export const fetchNetworkAPsEpic = (action$, state$) => {
  return action$.pipe(
    ofType(GET_NETWORK_APS_INIT.getType()),
    mergeMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'wifi']))
        .then(wifi => wifi.accessPoints())

      return from(promise).pipe(
        map(prop('obj')),
        map(response =>
          response.result === 'succeed'
            ? GET_NETWORK_APS_SUCCESS(filterDuplicateAPs(response.aps))
            : GET_NETWORK_APS_ERROR(response.error)
        ),
        catchError(err => of(GET_NETWORK_APS_ERROR(err)))
      )
    })
  )
}
