import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { path, pathOr } from 'ramda'
import { getApiPVS } from 'shared/api'
import {
  GET_INTERFACES_ERROR,
  GET_INTERFACES_INIT,
  GET_INTERFACES_SUCCESS,
  GET_NETWORK_APS_SUCCESS
} from 'state/actions/systemConfiguration'

export const fetchInterfacesEpic = action$ =>
  action$.pipe(
    ofType(GET_INTERFACES_INIT.getType(), GET_NETWORK_APS_SUCCESS.getType()),
    exhaustMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'network']))
        .then(api => api.getInterfaces())
        .then(pathOr([], ['body', 'networkstatus', 'interfaces']))

      return from(promise).pipe(
        map(payload => GET_INTERFACES_SUCCESS(payload)),
        catchError(err => {
          Sentry.captureException(err)
          return of(GET_INTERFACES_ERROR.asError(err.message))
        })
      )
    })
  )
