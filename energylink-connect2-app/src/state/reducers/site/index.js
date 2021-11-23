import { path, propOr } from 'ramda'
import { createReducer } from 'redux-act'

import {
  CREATE_SITE_ERROR,
  CREATE_SITE_INIT,
  CREATE_SITE_RESET,
  CREATE_SITE_SUCCESS,
  GET_SITE_SUCCESS,
  GET_SITES_ERROR,
  GET_SITES_INIT,
  GET_SITES_SUCCESS,
  RESET_SITE,
  SET_MAP_VIEW_SRC,
  SET_SITE,
  CREATE_HOMEOWNER_ACCOUNT_ERROR,
  CREATE_HOMEOWNER_ACCOUNT,
  CREATE_HOMEOWNER_ACCOUNT_COMPLETE,
  CREATE_HOMEOWNER_ACCOUNT_RESET,
  ON_GET_SITE_INFO,
  ON_GET_SITE_INFO_END,
  NO_SITE_FOUND,
  SITE_RESTRICTED
} from 'state/actions/site'

const initialState = {
  isSaving: false,
  isFetching: false,
  sites: [],
  site: null,
  error: null,
  saveError: '',
  saveModal: false,
  mapViewSrc: false,
  sitePVS: null,
  siteChanged: true,
  siteRestricted: false,
  homeownerCreation: {
    complete: false,
    creating: false,
    error: ''
  }
}

export const siteReducer = createReducer(
  {
    [CREATE_HOMEOWNER_ACCOUNT_RESET]: state => ({
      ...state,
      homeownerCreation: initialState.homeownerCreation
    }),
    [CREATE_HOMEOWNER_ACCOUNT]: state => ({
      ...state,
      homeownerCreation: { creating: true, error: undefined, complete: false }
    }),
    [CREATE_HOMEOWNER_ACCOUNT_COMPLETE]: state => ({
      ...state,
      homeownerCreation: { creating: false, complete: true, error: undefined }
    }),
    [CREATE_HOMEOWNER_ACCOUNT_ERROR]: (state, error) => ({
      ...state,
      homeownerCreation: {
        creating: false,
        complete: false,
        error:
          typeof error === typeof ''
            ? error
            : propOr('Something went wrong', 'message', error)
      }
    }),
    [CREATE_SITE_RESET]: state => ({
      ...state,
      saveModal: false
    }),
    [CREATE_SITE_INIT]: state => ({
      ...state,
      isSaving: true,
      saveError: ''
    }),
    [CREATE_SITE_SUCCESS]: state => ({
      ...state,
      isSaving: false,
      saveError: '',
      saveModal: true
    }),
    [CREATE_SITE_ERROR]: (state, error) => ({
      ...initialState,
      saveModal: false,
      saveError: path(['response', 'body', 'message'], error)
        ? 'PLACES_ERROR'
        : 'SITE_CREATE_ERROR'
    }),
    [GET_SITES_INIT]: state => ({
      ...state,
      siteRestricted: initialState.siteRestricted,
      isFetching: true,
      error: null
    }),
    [GET_SITES_SUCCESS]: (state, payload) => ({
      ...state,
      isFetching: false,
      sites: payload,
      error: null
    }),
    [NO_SITE_FOUND]: state => ({
      ...state,
      isFetching: false,
      sites: [],
      error: null
    }),
    [GET_SITES_ERROR]: (state, payload) => ({
      ...initialState,
      error: payload
    }),
    [SITE_RESTRICTED]: state => ({
      ...state,
      isFetching: initialState.isFetching,
      sites: initialState.sites,
      siteRestricted: true
    }),
    [SET_SITE]: (state, site) => {
      const lastSiteKey = path(['site', 'siteKey'], state)
      const siteChanged = site.siteKey !== lastSiteKey
      return {
        ...state,
        site,
        sitePVS: null,
        siteChanged
      }
    },

    [SET_MAP_VIEW_SRC]: (state, mapViewSrc) => ({
      ...state,
      mapViewSrc
    }),
    [RESET_SITE]: state => ({
      ...state,
      mapViewSrc: null,
      error: null,
      site: null,
      sitePVS: null
    }),
    [GET_SITE_SUCCESS]: (state, payload) => ({
      ...state,
      sitePVS: payload,
      isFetching: false
    }),
    [ON_GET_SITE_INFO]: state => ({
      ...state,
      isFetching: true,
      error: null
    }),
    [ON_GET_SITE_INFO_END]: (
      state,
      { error, message, contractNumber, financeType }
    ) => {
      return {
        ...state,
        isFetching: false,
        error: error ? message : null,
        site: error
          ? state.site
          : { ...state.site, contractNumber, financeType }
      }
    }
  },
  initialState
)
