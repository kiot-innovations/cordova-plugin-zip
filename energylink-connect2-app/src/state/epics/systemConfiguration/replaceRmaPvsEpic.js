import * as Sentry from '@sentry/browser'
import { path, pathOr, propOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import {
  REPLACE_RMA_PVS,
  SUBMIT_CONFIG,
  SUBMIT_COMMISSION_ERROR
} from 'state/actions/systemConfiguration'

export const replaceRmaPvsEpic = (action$, state$) =>
  action$.pipe(
    ofType(REPLACE_RMA_PVS.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'commission']))
        .then(api =>
          api.decommissionOldPVS(
            { id: 1 },
            {
              requestBody: {
                site_key: state$.value.site.site.siteKey,
                serial_number: state$.value.rma.pvs
              }
            }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_CONFIG(payload)
            : SUBMIT_COMMISSION_ERROR({
                code: propOr('Unknown code', 'code', response),
                message: propOr('Unknown error.', 'message', response)
              })
        ),
        catchError(err => {
          Sentry.captureException(err)
          return of(
            SUBMIT_COMMISSION_ERROR({
              code: pathOr('Unknown code', ['response', 'body', 'code'], err),
              message: pathOr(
                'Unknown error.',
                ['response', 'body', 'msg'],
                err
              )
            })
          )
        })
      )
    })
  )
