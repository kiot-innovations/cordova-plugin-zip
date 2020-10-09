import { getApiParty } from 'shared/api'
import { path } from 'ramda'

export const getPartyPromise = (accessToken, partyId) =>
  getApiParty(accessToken)
    .then(path(['apis', 'default']))
    .then(api => api.Get_Party({ partyId }))
