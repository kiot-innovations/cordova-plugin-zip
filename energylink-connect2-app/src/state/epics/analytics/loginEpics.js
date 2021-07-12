import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators'

import { loggedIn, loginFailed } from 'shared/analytics'
import { dismissBrowser } from 'shared/browserUtils'
import { MIXPANEL_EVENT_ERROR } from 'state/actions/analytics'
import { LOGIN_ERROR, LOGIN_SUCCESS } from 'state/actions/auth'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'
import { SET_DEALER_NAME } from 'state/actions/user'
import { getPartyPromise } from 'state/epics/analytics/epicUtils'

export const loginSuccessEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_SUCCESS.getType()),
    mergeMap(
      ({
        payload: {
          data: user,
          auth: { access_token: accessToken }
        }
      }) => {
        const { partyId } = user
        dismissBrowser()
        return from(getPartyPromise(accessToken, partyId)).pipe(
          switchMap(({ status, body: { parentDisplayName: dealerName } }) =>
            status === 200
              ? of(
                  loggedIn({ ...user, dealerName }),
                  SET_DEALER_NAME(dealerName)
                )
              : of(loggedIn(user))
          ),
          catchError(error =>
            of(
              loggedIn(user),
              MIXPANEL_EVENT_ERROR({
                error,
                breadcrumbs: [
                  {
                    type: 'http',
                    message: 'Failed to get dealer name from EDP Party API.',
                    category: 'fetch',
                    data: { method: 'GET', operation: 'Get_Party' }
                  }
                ]
              })
            )
          )
        )
      }
    )
  )

export const loginErrorEpic = action$ =>
  action$.pipe(ofType(LOGIN_ERROR.getType()), map(loginFailed))

export const downloadESSOnLoginEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_SUCCESS.getType()),
    mergeMap(() => of(DOWNLOAD_OS_INIT()))
  )

export default [downloadESSOnLoginEpic, loginSuccessEpic, loginErrorEpic]
