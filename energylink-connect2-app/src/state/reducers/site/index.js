import { createReducer } from 'redux-act'

import {
  GET_SITES_INIT,
  GET_SITES_SUCCESS,
  GET_SITES_ERROR,
  SET_SITE,
  SET_MAP_VIEW_SRC,
  RESET_SITE
} from 'state/actions/site'

const initialState = {
  isFetching: false,
  sites: [], // []
  site: null, // { address1, city, latitude, longitude }
  error: null,
  mapViewSrc: false
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
    }),

    [SET_MAP_VIEW_SRC]: (state, mapViewSrc) => ({
      ...state,
      mapViewSrc
    }),
    [RESET_SITE]: state => ({
      ...state,
      mapViewSrc: null,
      error: null,
      site: null
    })
  },
  initialState
)
