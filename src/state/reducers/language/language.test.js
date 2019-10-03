import * as languageActions from '../../actions/language'
import { languageReducer } from '.'

describe('Language reducer', () => {
  const reducerTest = reducerTester(languageReducer)

  it('returns the initial state', () => {
    reducerTest({ locale: 'en' }, {}, { locale: 'en' })
  })

  it('changes locale when LOGIN_INIT action is fired', () => {
    reducerTest({ locale: 'en' }, languageActions.SET_LANGUAGE('es'), {
      locale: 'es'
    })
  })
})
