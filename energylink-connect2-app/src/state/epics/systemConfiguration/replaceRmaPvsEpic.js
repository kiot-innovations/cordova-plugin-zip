import * as Sentry from '@sentry/browser'
import { path, pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import {
  REPLACE_RMA_PVS,
  SUBMIT_CONFIG,
  SUBMIT_COMMISSION_ERROR
} from 'state/actions/systemConfiguration'

export const replaceRmaPvsEpic = (action$, state$) =>
  action$.pipe(
    ofType(REPLACE_RMA_PVS.getType()),
    mergeMap(({ payload }) => {
      const t = translate()
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
                error: pathOr(
                  t('REPLACE_RMA_PVS_ERROR'),
                  ['response', 'body', 'msg'],
                  response
                )
              })
        ),
        catchError(response => {
          Sentry.captureException(response)
          return of(
            SUBMIT_COMMISSION_ERROR({
              error: t('REPLACE_RMA_PVS_ERROR'),
              code: pathOr(
                'Unknown code',
                ['response', 'body', 'code'],
                response
              ),
              message: pathOr(
                'Unknown error.',
                ['response', 'body', 'msg'],
                response
              )
            })
          )
        })
      )
    })
  )
