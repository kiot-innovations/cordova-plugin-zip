import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import { forEach } from 'ramda'
import * as Sentry from '@sentry/browser'
import { EMPTY_ACTION } from 'state/actions/share'
import { MIXPANEL_EVENT_ERROR } from 'state/actions/analytics'

export const errorEpic = action$ =>
  action$.pipe(
    ofType(MIXPANEL_EVENT_ERROR.getType()),
    map(({ payload: { error, breadcrumbs } }) => {
      forEach(Sentry.addBreadcrumb, breadcrumbs)
      Sentry.captureException(error)
      return EMPTY_ACTION()
    })
  )
