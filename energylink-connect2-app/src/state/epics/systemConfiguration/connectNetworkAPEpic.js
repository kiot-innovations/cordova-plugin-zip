import * as Sentry from '@sentry/browser'
import { includes, path, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import {
  CONNECT_NETWORK_AP_INIT,
  CONNECT_NETWORK_AP_ERROR,
  GET_INTERFACES_INIT,
  SET_WPS_CONNECTION_STATUS
} from 'state/actions/systemConfiguration'

const trackConnectionError = (mode, error) =>
  mode === 'wps-pbc'
    ? of(CONNECT_NETWORK_AP_ERROR(error), SET_WPS_CONNECTION_STATUS('error'))
    : of(CONNECT_NETWORK_AP_ERROR(error))

export const connectNetworkAPEpic = (action$, state$) => {
  return action$.pipe(
    ofType(CONNECT_NETWORK_AP_INIT.getType()),
    exhaustMap(({ payload }) => {
      const wpsSupport = state$.value.pvs.wpsSupport
      const promise = getApiPVS()
        .then(path(['apis', 'wifi']))
        .then(wifi =>
          wpsSupport
            ? wifi.connectToAccessPoint_v3(
                { id: 1 },
                {
                  requestBody: payload
                }
              )
            : wifi.connectToAccessPoint(
                { id: 1 },
                {
                  requestBody: payload
                }
              )
        )

      return from(promise).pipe(
        map(prop('body')),
        switchMap(response => {
          const { mode } = payload

          if (!includes(response.result, ['success', 'succeed'])) {
            return trackConnectionError(mode, response.error)
          }

          return mode === 'wps-pbc'
            ? of(GET_INTERFACES_INIT(), SET_WPS_CONNECTION_STATUS('success'))
            : of(GET_INTERFACES_INIT())
        }),
        catchError(error => {
          const { mode } = payload

          Sentry.captureException(error)
          return trackConnectionError(mode, error)
        })
      )
    })
  )
}
