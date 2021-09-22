import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import { TAGS } from 'shared/utils'
import * as pvsActions from 'state/actions/pvs'

export const startCommissioningEpic = action$ =>
  action$.pipe(
    ofType(pvsActions.START_COMMISSIONING_INIT.getType()),
    mergeMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'commissioning']))
        .then(api => api.startCommissioning())

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? pvsActions.START_COMMISSIONING_SUCCESS(response) // { result: "succeed", supervisor: {...} }
            : pvsActions.START_COMMISSIONING_ERROR('SEND_COMMAND_ERROR')
        ),
        catchError(err => {
          Sentry.setTag(TAGS.KEY.ENDPOINT, TAGS.VALUE.START_COMMISSIONING)
          Sentry.captureException(err)
          return of(pvsActions.START_COMMISSIONING_ERROR(err))
        })
      )
    })
  )
