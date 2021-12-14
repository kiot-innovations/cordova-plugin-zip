import moment from 'moment'
import { isNil, pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'

import { LOGOUT, REFRESH_TOKEN_INIT } from 'state/actions/auth'
import * as mobileActions from 'state/actions/mobile'
import { DEVICE_READY } from 'state/actions/mobile'
import { EMPTY_ACTION } from 'state/actions/share'

export const validateSessionEpic = (action$, state$) =>
  action$.pipe(
    ofType(mobileActions.DEVICE_RESUME.getType(), DEVICE_READY.getType()),
    map(() => {
      const { expires_in_date } = pathOr({}, ['user', 'auth'], state$.value)
      const exp = pathOr(null, ['user', 'data', 'exp'], state$.value)

      const expirySourceOfTruth = isNil(expires_in_date) ? exp : expires_in_date

      if (isNil(expirySourceOfTruth)) return LOGOUT()

      const expires = moment(expirySourceOfTruth * 1000) // future expiration date
      const timeDifference = expires.diff(moment(), 'hours')

      // if we have more than 3h before the token expires, we're go to go
      const isValid = timeDifference > 3
      console.info({ isValid, timeDifference })
      return expires > 0 && !isValid ? REFRESH_TOKEN_INIT() : EMPTY_ACTION()
    })
  )
