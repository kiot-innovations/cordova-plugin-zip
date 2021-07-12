import { compose, isNil, path, prop } from 'ramda'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'

import Toggler from 'components/Toggler'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { LOGOUT } from 'state/actions/auth'
import { SET_SHOW_CHECKLIST } from 'state/actions/settings'
import { MENU_HIDE } from 'state/actions/ui'

function Settings() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { showPrecommissioningChecklist } = useSelector(prop('global'))
  const name = useSelector(path(['user', 'data', 'name']))

  const logout = () => {
    dispatch(LOGOUT())
    dispatch(MENU_HIDE())
    history.push(paths.PROTECTED.ROOT.path)
  }

  return (
    <main className="full-height pl-15 pr-15">
      <h5 className="is-uppercase is-block is-full-width has-text-centered is-bold mb-30">
        {t('SETTINGS')}
      </h5>
      <section>
        <h6 className="has-text-white">{t('APP_SETTINGS')}</h6>

        <article>
          <div className="mt-20">
            <Toggler
              text={t('SETTING_CHECKLIST')}
              checked={showPrecommissioningChecklist}
              onChange={compose(dispatch, SET_SHOW_CHECKLIST)}
            />
          </div>
        </article>

        <article role="button" onClick={logout}>
          <hr className=" mb-10" />
          <h6 className="has-text-white mb-10">{t('BTN_LOG_OUT')}</h6>
          {either(!isNil(name), <p>{t('LOGGED_IN', name)}</p>)}
          <hr className="mt-10" />
        </article>
      </section>
    </main>
  )
}

export default Settings
