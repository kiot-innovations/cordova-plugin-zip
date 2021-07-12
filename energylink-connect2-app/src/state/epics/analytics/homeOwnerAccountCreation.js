import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { registerHomeOwnerAccount } from 'shared/analytics'
import { getUrl } from 'shared/utils'
import {
  CREATE_HOMEOWNER_ACCOUNT_ERROR,
  CREATE_HOMEOWNER_ACCOUNT_COMPLETE
} from 'state/actions/site'

export const homeOwnerAccountCreationFailed = action$ =>
  action$.pipe(
    ofType(CREATE_HOMEOWNER_ACCOUNT_ERROR.getType()),
    switchMap(({ payload }) => {
      const registeredLocation = getUrl()
      return of(
        registerHomeOwnerAccount({
          location: registeredLocation,
          errorMessage: payload
        })
      )
    })
  )

export const homeOwnerAccountCreationSuccess = action$ =>
  action$.pipe(
    ofType(CREATE_HOMEOWNER_ACCOUNT_COMPLETE.getType()),
    switchMap(() => {
      const registeredLocation = getUrl()
      return of(registerHomeOwnerAccount({ location: registeredLocation }))
    })
  )

export default [homeOwnerAccountCreationFailed, homeOwnerAccountCreationSuccess]
