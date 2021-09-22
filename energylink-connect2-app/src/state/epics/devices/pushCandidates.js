import { differenceWith, path, pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import { isSerialEqual, TAGS } from 'shared/utils'
import {
  PUSH_CANDIDATES_ERROR,
  PUSH_CANDIDATES_INIT,
  PUSH_CANDIDATES_SUCCESS
} from 'state/actions/devices'

export const pushCandidatesEpic = (action$, state$) =>
  action$.pipe(
    ofType(PUSH_CANDIDATES_INIT.getType()),
    withLatestFrom(state$),
    mergeMap(([{ payload }, state]) => {
      if (!payload) alert('No Payload')
      const promise = getApiPVS()
        .then(path(['apis', 'candidates']))
        .then(api =>
          api.setCandidates(
            { id: 1 },
            {
              requestBody: differenceWith(
                isSerialEqual,
                payload,
                pathOr([], ['devices', 'miFound'], state)
              )
            }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? PUSH_CANDIDATES_SUCCESS(response)
            : PUSH_CANDIDATES_ERROR({
                msg: 'ERROR_EXECUTING_COMMAND',
                candidates: payload
              })
        ),
        catchError(err => {
          Sentry.setTag(TAGS.KEY.ENDPOINT, TAGS.VALUE.DEVICES_SET_CANDIDATES)
          Sentry.captureException(err)
          return of(PUSH_CANDIDATES_ERROR({ error: err, candidates: payload }))
        })
      )
    })
  )
