import { createReducer } from 'redux-act'

import {
  GET_SITES_INIT,
  GET_SITES_SUCCESS,
  GET_SITES_ERROR,
  SET_SITE
} from 'state/actions/site'

const initialState = {
  isFetching: false,
  sites: null, // { items: { totalSitesFound, hits } }
  site: null, // { address, city, state, lat_deg, long_dev }
  error: null
}

export const siteReducer = createReducer(
  {
    [GET_SITES_INIT]: (state, payload) => ({
      ...state,
      isFetching: true
    }),

    [GET_SITES_SUCCESS]: (state, payload) => ({
      ...state,
      isFetching: false,
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
