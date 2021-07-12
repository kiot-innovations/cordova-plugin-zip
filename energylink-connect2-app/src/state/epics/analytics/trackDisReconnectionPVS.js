import { ofType } from 'redux-observable'
import { EMPTY, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { trackDisconnectionPVS, trackReconnectionPVS } from 'shared/analytics'
import { SET_CONNECTION_STATUS } from 'state/actions/network'

const trackDisReconnectionPVS = (action$, state$) =>
  action$.pipe(
    ofType(SET_CONNECTION_STATUS.getType()),
    switchMap(() => {
      const { disconnectionTimer, reconnectionTime } = state$.value.analytics

      if (disconnectionTimer) {
        return of(trackDisconnectionPVS())
      }

      if (reconnectionTime) {
        return of(
          trackReconnectionPVS({
            reconnectionTime
          })
        )
      }

      return EMPTY
    })
  )

export default [trackDisReconnectionPVS]
