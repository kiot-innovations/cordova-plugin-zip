import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import { loggedIn } from 'shared/analytics'
import { LOGIN_SUCCESS } from 'state/actions/auth'
import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'

export const loginSuccessEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_SUCCESS.getType()),
    map(({ payload: { data: user } }) => {
      loggedIn(user)
      return MIXPANEL_EVENT_QUEUED()
    })
  )
