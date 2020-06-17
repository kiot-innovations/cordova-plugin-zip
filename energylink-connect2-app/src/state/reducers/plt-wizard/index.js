import { createReducer } from 'redux-act'
import {
  PLT_SAVE,
  PLT_SAVE_ERROR,
  PLT_SAVE_FINISHED
} from 'state/actions/panel-layout-tool'

const initialState = {
  saving: false,
  saved: false,
  error: ''
}

export const pltWizard = createReducer(
  {
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
      error: ''
    }),
    [PLT_SAVE_ERROR]: (state, error) => ({
      ...state,
      saving: false,
      error
    })
  },
  initialState
)
