import * as Sentry from '@sentry/browser'
import { includes, path, pathOr, propOr, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { translate } from 'shared/i18n'
import { edpErrorMessage } from 'shared/utils'
import {
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_COMMISSION_SUCCESS,
  SUBMIT_COMMISSION_ERROR
} from 'state/actions/systemConfiguration'

const pvsIsOffline = message =>
  includes('Errno 101', message) || includes('Errno -2', message)

export const submitConfigObjectEpic = (action$, state$) => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG_SUCCESS.getType()),
    mergeMap(() => {
      const t = translate()
      const promise = getApiPVS()
        .then(path(['apis', 'commission']))
        .then(api => api.sendConfig({ id: 1 }, { requestBody: {} }))

      return from(promise).pipe(
        map(prop('result')),
        map(SUBMIT_COMMISSION_SUCCESS),
        catchError(error => {
          const apiResult = pathOr({}, ['response', 'body', 'result'], error)
          const pvsSn = state$.value.pvs.serialNumber
          const message = propOr('Unknown message', 'message', apiResult)

          const data = {
            pvsSerialNumber: pvsSn,
            code: propOr('Unknown code', 'code', apiResult),
            message,
            exception: propOr('Unknown exception', 'exception', apiResult)
          }

          const text = pvsIsOffline(message)
            ? t('COMMISSION_ERROR_NO_INTERNET')
            : edpErrorMessage(apiResult)

          Sentry.addBreadcrumb({
            data,
            message: t('COMMISSIONING_ERROR'),
            type: 'error',
            category: 'error',
            level: 'error'
          })
          Sentry.captureMessage(text)
          Sentry.captureException(error)
          return of(SUBMIT_COMMISSION_ERROR(data))
        })
      )
    })
  )
}
