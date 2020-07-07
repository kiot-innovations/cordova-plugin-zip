import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { path, prop } from 'ramda'
import {
  CONNECT_NETWORK_AP_INIT,
  CONNECT_NETWORK_AP_ERROR,
  GET_INTERFACES_INIT
} from 'state/actions/systemConfiguration'
import { getApiPVS } from 'shared/api'

export const connectNetworkAPEpic = (action$, state$) => {
  return action$.pipe(
    ofType(CONNECT_NETWORK_AP_INIT.getType()),
    exhaustMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'wifi']))
        .then(wifi =>
          wifi.connectToAccessPoint(
            { id: 1 },
            {
              requestBody: payload
            }
          )
        )

      return from(promise).pipe(
        map(prop('body')),
        map(response =>
          response.result === 'succeed'
            ? GET_INTERFACES_INIT()
            : CONNECT_NETWORK_AP_ERROR(response.error)
        ),
        catchError(err => {
          Sentry.captureException(err)
          return of(CONNECT_NETWORK_AP_ERROR(err))
        })
      )
    })
  )
}
