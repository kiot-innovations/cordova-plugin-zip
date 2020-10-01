import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { path } from 'ramda'
import { loggedIn, loginFailed } from 'shared/analytics'
import { getApiParty } from 'shared/api'
import { LOGIN_ERROR, LOGIN_SUCCESS } from 'state/actions/auth'
import { MIXPANEL_EVENT_ERROR } from 'state/actions/analytics'

const getPartyPromise = (accessToken, partyId) =>
  getApiParty(accessToken)
    .then(path(['apis', 'default']))
    .then(api => api.Get_Party({ partyId }))

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

        return from(getPartyPromise(accessToken, partyId)).pipe(
          map(({ status, body: { parentDisplayName: dealerName } }) =>
            status === 200
              ? loggedIn({ ...user, ...{ dealerName } })
              : MIXPANEL_EVENT_ERROR()
          ),
          catchError(error => of(MIXPANEL_EVENT_ERROR(error)))
        )
      }
    )
  )

export const loginErrorEpic = action$ =>
  action$.pipe(ofType(LOGIN_ERROR.getType()), map(loginFailed))
