import { pathOr, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiParty } from 'shared/api'
import { getAccessToken } from 'shared/utils'
import {
  CREATE_HOMEOWNER_ACCOUNT,
  CREATE_HOMEOWNER_ACCOUNT_COMPLETE,
  CREATE_HOMEOWNER_ACCOUNT_ERROR,
  ACTIVATE_HOMEOWNER_ACCOUNT
} from 'state/actions/site'

const reportCreateHOError = catchError(err => {
  Sentry.captureException(err)
  return of(CREATE_HOMEOWNER_ACCOUNT_ERROR.asError(err.message))
})

const createHomeOwnerAccount = async (payload, state) => {
  const partyApi = await getApiParty(getAccessToken(state))
  const response = await partyApi.apis.Party.create_homeowner(
    { id: 1 },
    {
      requestBody: {
        ...payload,
        siteKey: pathOr('', ['site', 'site', 'siteKey'], state)
      }
    }
  )
  return JSON.parse(response.data)
}

const createHomeOwnerAccountEpic = (action$, state$) =>
  action$.pipe(
    ofType(CREATE_HOMEOWNER_ACCOUNT.getType()),
    withLatestFrom(state$),
    exhaustMap(([{ payload }, state]) =>
      from(createHomeOwnerAccount(payload, state)).pipe(
        map(ACTIVATE_HOMEOWNER_ACCOUNT),
        reportCreateHOError
      )
    )
  )

const activateHomeOwnerAccount = async (payload, state) => {
  const partyApi = await getApiParty(getAccessToken(state))
  const response = await partyApi.apis.Party.ActivateHomeowner({
    partyId: prop('partyId', payload)
  })
  return JSON.parse(response.data)
}

const activateHomeOwnerAccountEpic = (action$, state$) =>
  action$.pipe(
    ofType(ACTIVATE_HOMEOWNER_ACCOUNT.getType()),
    withLatestFrom(state$),
    exhaustMap(([{ payload }, state]) =>
      from(activateHomeOwnerAccount(payload, state)).pipe(
        map(CREATE_HOMEOWNER_ACCOUNT_COMPLETE),
        reportCreateHOError
      )
    )
  )

export default [createHomeOwnerAccountEpic, activateHomeOwnerAccountEpic]
