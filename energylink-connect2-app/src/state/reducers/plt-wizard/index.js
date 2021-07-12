import { createReducer } from 'redux-act'

import {
  PLT_LAST_MODIFIED_DATE,
  PLT_LOAD,
  PLT_LOAD_ERROR,
  PLT_LOAD_FINISHED,
  PLT_MARK_AS_CHANGED,
  PLT_SAVE,
  PLT_SAVE_ERROR,
  PLT_SAVE_FINISHED
} from 'state/actions/panel-layout-tool'

const initialState = {
  saving: false,
  saved: false,
  error: '',
  loading: false,
  changed: false,
  panels: [],
  lastModifiedDate: undefined //'2020-11-10T23:05:59.908Z' // TODO fetch the actual date from EDP
}

export const pltWizard = createReducer(
  {
    [PLT_LOAD]: state => ({
      ...state,
      loading: true
    }),
    [PLT_LOAD_FINISHED]: (state, panels) => ({
      ...state,
      loading: false,
      changed: false,
      panels
    }),
    [PLT_LAST_MODIFIED_DATE]: (state, lastModifiedDate) => ({
      ...state,
      lastModifiedDate
    }),
    [PLT_LOAD_ERROR]: state => ({
      ...state,
      loading: false
    }),
    [PLT_SAVE]: state => ({
      ...state,
      saving: true,
      saved: false,
      error: ''
    }),
    [PLT_SAVE_FINISHED]: state => ({
      ...state,
      saving: false,
      saved: true,
      error: '',
      changed: false
    }),
    [PLT_SAVE_ERROR]: (state, error) => ({
      ...state,
      saving: false,
      error
    }),
    [PLT_MARK_AS_CHANGED]: state => ({ ...state, changed: true })
  },
  initialState
)
