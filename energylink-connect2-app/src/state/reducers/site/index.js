import { createReducer } from 'redux-act'

import {
  GET_SITES_INIT,
  GET_SITES_SUCCESS,
  GET_SITES_ERROR,
  SET_SITE
} from 'state/actions/site'

const initialState = {
  fetchSites: false,
  sites: null, // { items: { recordsCount, hits } }
  site: null,
  error: null
}

export const siteReducer = createReducer(
  {
    [GET_SITES_INIT]: (state, payload) => ({
      fetchSites: true
    }),

    [GET_SITES_SUCCESS]: (state, payload) => ({
      fetchSites: false,
      sites: payload
    }),
    [GET_SITES_ERROR]: (state, payload) => ({
      ...initialState,
      error: payload
    }),

    [SET_SITE]: (state, payload) => ({
      ...state,
      site: payload
    })
  },
  initialState
)
