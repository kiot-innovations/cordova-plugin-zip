import { ofType } from 'redux-observable'
import {
  SENTRY_START_LISTENER,
  SENTRY_UNQUEUE_EVENT
} from 'state/actions/sentry'

import { switchMap } from 'rxjs/operators'
import { interval, of } from 'rxjs'
import * as Sentry from '@sentry/browser'
import { EMPTY } from 'rxjs'

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
