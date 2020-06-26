import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import {
  SUBMIT_COMMISSION_ERROR,
  COMMISSION_ERROR_REPORTED
} from 'state/actions/systemConfiguration'
import { pathOr } from 'ramda'
import { translate } from 'shared/i18n'
import * as Sentry from '@sentry/browser'

export const reportCommissionErrorEpic = (action$, state$) => {
  const t = translate(state$.value.language)
  return action$.pipe(
    ofType(SUBMIT_COMMISSION_ERROR.getType()),
    map(({ payload }) => {
      Sentry.addBreadcrumb({
        category: 'commissionError',
        message: 'Environment: Test',
        level: Sentry.Severity.Info
      })
      Sentry.addBreadcrumb({
        category: 'commissionError',
        message: `Site Key: ${pathOr(
          t('SITE_KEY_ERROR'),
          ['value', 'site', 'site', 'siteKey'],
          state$
        )}`,
        level: Sentry.Severity.Info
      })
      Sentry.addBreadcrumb({
        category: 'commissionError',
        message: `PVS SN: ${pathOr(
          t('PVS_SN_ERROR'),
          ['value', 'pvs', 'serialNumber'],
          state$
        )}`,
        level: Sentry.Severity.Info
      })
      Sentry.captureMessage(payload)
      return COMMISSION_ERROR_REPORTED()
    })
  )
}
