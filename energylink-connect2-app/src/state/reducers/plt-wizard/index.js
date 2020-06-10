import { createReducer } from 'redux-act'
import {
  PLT_SAVE,
  PLT_SAVE_ERROR,
  PLT_SAVE_FINISHED
} from 'state/actions/panel-layout-tool'

export const pltWizard = createReducer(
  {
    [PLT_SAVE]: state => ({
      ...state,
      saving: true,
      saved: false
    }),
    [PLT_SAVE_FINISHED]: state => ({
      ...state,
      saving: false,
      saved: true
    }),
    [PLT_SAVE_ERROR]: state => ({
      ...state,
      saving: false
    })
  },
  {
    saving: false,
    saved: false
  }
)
