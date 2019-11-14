import { createReducer } from 'redux-act'
import { SET_LANGUAGE } from '../../actions/language'

export const languageReducer = createReducer(
  {
    [SET_LANGUAGE]: (state, payload) => ({
      locale: payload
    })
  },
  {
    locale: 'en'
  }
)
