import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { path, prop, find, propEq } from 'ramda'
import {
  CONNECT_NETWORK_AP_INIT,
  CONNECT_NETWORK_AP_SUCCESS,
  CONNECT_NETWORK_AP_ERROR
} from 'state/actions/systemConfiguration'
import { getApiPVS } from 'shared/api'

const findAP = (ssid, aps) => find(propEq('ssid', ssid), aps)
const getAPs = path(['systemConfiguration', 'network', 'aps'])

export const connectNetworkAPEpic = (action$, state$) => {
  return action$.pipe(
    ofType(CONNECT_NETWORK_AP_INIT.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'communications']))
        .then(communications => communications.connectToAccessPoint(payload))

      return from(promise).pipe(
        map(prop('obj')),
        map(response =>
          response.result === 'succeed'
            ? CONNECT_NETWORK_AP_SUCCESS(
                findAP(payload.ssid, getAPs(state$.value))
              )
            : CONNECT_NETWORK_AP_ERROR(response.error)
        ),
        catchError(err => of(CONNECT_NETWORK_AP_ERROR(err)))
      )
    })
  )
}
