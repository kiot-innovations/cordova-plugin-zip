import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { exhaustMap, map, catchError } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { COMMISSION_SUCCESS } from 'state/actions/analytics'
import {
  WAKELOCK_RELEASE,
  WAKELOCK_RELEASED,
  WAKELOCK_RELEASE_ERROR
} from 'state/actions/wakelock'
import { releaseWakeLock } from './utilities'

export const release = action$ =>
  action$.pipe(
    ofType(COMMISSION_SUCCESS.getType(), WAKELOCK_RELEASE.getType()),
    exhaustMap(() =>
      from(releaseWakeLock()).pipe(
        map(WAKELOCK_RELEASED),
        catchError(() => {
          Sentry.captureException(new Error('Failed to release wakelock'))
          return of(WAKELOCK_RELEASE_ERROR())
        })
      )
    )
  )
