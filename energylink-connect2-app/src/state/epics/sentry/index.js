import { ofType } from 'redux-observable'
import { interval, of, EMPTY } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import {
  SENTRY_START_LISTENER,
  SENTRY_UNQUEUE_EVENT
} from 'state/actions/sentry'

const sendPendingEventsEpic = (action$, state$) =>
  action$.pipe(
    ofType(SENTRY_START_LISTENER.getType()),
    switchMap(() =>
      interval(10000).pipe(
        switchMap(() => {
          const [event] = state$.value.sentry.pendingEvents
          if (!event) return EMPTY

          Sentry.captureEvent(event)
          return of(SENTRY_UNQUEUE_EVENT(event))
        })
      )
    )
  )

export default [sendPendingEventsEpic]
