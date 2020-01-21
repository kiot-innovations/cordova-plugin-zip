import { createReducer } from 'redux-act'

import {
  GET_SITES_INIT,
  GET_SITES_SUCCESS,
  GET_SITES_ERROR,
  SET_SITE
} from 'state/actions/site'

const initialState = {
  isFetching: false,
  sites: [], // []
  site: null, // { address1, city, latitude, longitude }
  error: null
}

export const siteReducer = createReducer(
  {
    [GET_SITES_INIT]: (state, payload) => ({
      ...state,
      isFetching: true,
      error: null
    }),

    [GET_SITES_SUCCESS]: (state, payload) => ({
      ...state,
      isFetching: false,
      sites: payload,
      error: null
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
