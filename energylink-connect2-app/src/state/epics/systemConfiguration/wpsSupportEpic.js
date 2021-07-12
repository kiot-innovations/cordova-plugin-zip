import * as Sentry from '@sentry/browser'
import { is, path, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { PVS_CONNECTION_SUCCESS } from 'state/actions/network'
import { SET_WPS_SUPPORT } from 'state/actions/pvs'

export const wpsSupportEpic = action$ => {
  return action$.pipe(
    ofType(PVS_CONNECTION_SUCCESS.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'wifi']))
        .then(wifi => {
          const wpsApi = prop('connectToAccessPoint_v3', wifi)
          return is(Function, wpsApi)
        })

      return from(promise).pipe(
        map(wpsSupportPresent =>
          wpsSupportPresent ? SET_WPS_SUPPORT(true) : SET_WPS_SUPPORT(false)
        ),
        catchError(err => {
          Sentry.captureException(err)
        })
      )
    })
  )
}
