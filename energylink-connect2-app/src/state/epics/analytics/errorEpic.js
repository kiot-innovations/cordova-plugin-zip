import { forEach } from 'ramda'
import { ofType } from 'redux-observable'
import { EMPTY } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { MIXPANEL_EVENT_ERROR } from 'state/actions/analytics'

export const errorEpic = action$ =>
  action$.pipe(
    ofType(MIXPANEL_EVENT_ERROR.getType()),
    mergeMap(({ payload: { error, breadcrumbs } }) => {
      forEach(Sentry.addBreadcrumb, breadcrumbs)
      Sentry.captureException(error)
      return EMPTY
    })
  )
