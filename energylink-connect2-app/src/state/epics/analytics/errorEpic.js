import { ofType } from 'redux-observable'
import { mergeMap } from 'rxjs/operators'
import { forEach } from 'ramda'
import * as Sentry from '@sentry/browser'
import { MIXPANEL_EVENT_ERROR } from 'state/actions/analytics'
import { EMPTY } from 'rxjs'

export const errorEpic = action$ =>
  action$.pipe(
    ofType(MIXPANEL_EVENT_ERROR.getType()),
    mergeMap(({ payload: { error, breadcrumbs } }) => {
      forEach(Sentry.addBreadcrumb, breadcrumbs)
      Sentry.captureException(error)
      return EMPTY
    })
  )
