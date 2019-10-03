import React from 'react'
import { useI18n } from '../../shared/i18n'
import { useDispatch } from 'react-redux'
import { logout } from '../../state/actions/auth'

import './Logout.scss'

const logOut = dispatch => () => dispatch(logout())

function Logout() {
  const t = useI18n()
  const dispatch = useDispatch()

  return (
    <button
      className="logout button is-text  has-text-primary is-uppercase "
      onClick={logOut(dispatch)}
    >
      {t('LOGOUT')}
    </button>
  )
}

export default Logout
