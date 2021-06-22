import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { exhaustMap, map, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { SET_SITE } from 'state/actions/site'
import {
  WAKELOCK_ACQUIRED,
  WAKELOCK_ACQUIRE_ERROR
} from 'state/actions/wakelock'
import { acquireWakeLock } from './utilities'

export const acquire = action$ =>
  action$.pipe(
    ofType(SET_SITE.getType()),
    exhaustMap(() =>
      from(acquireWakeLock()).pipe(
        map(WAKELOCK_ACQUIRED),
        catchError(() => {
          Sentry.captureException(new Error('Failed to acquire wakelock'))
          return of(WAKELOCK_ACQUIRE_ERROR())
        })
      )
    )
  )
