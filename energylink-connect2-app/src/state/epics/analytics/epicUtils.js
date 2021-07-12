import { path } from 'ramda'

import { getApiParty } from 'shared/api'

export const getPartyPromise = (accessToken, partyId) =>
  getApiParty(accessToken)
    .then(path(['apis', 'default']))
    .then(api => api.Get_Party({ partyId }))
