import React, { useEffect, useCallback } from 'react'
import { pathOr } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'

import './Permissions.scss'
import { OPEN_SETTINGS, CHECK_PERMISSIONS_INIT } from 'state/actions/network'
import { either } from 'shared/utils'

const Permissions = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    bluetoothAuthorized,
    checkingPermission,
    checkingPermissionError
  } = useSelector(pathOr({}, ['network']))

  const openSettings = () => {
    dispatch(OPEN_SETTINGS())
  }

  const checkPermissions = useCallback(() => {
    if (bluetoothAuthorized)
      return history.push(paths.PROTECTED.CONNECT_TO_PVS.path)
    dispatch(CHECK_PERMISSIONS_INIT())
  }, [bluetoothAuthorized, dispatch, history])

  useEffect(() => {
    checkPermissions()
  }, [checkPermissions])

  return (
    <section className="perms pr-10 pl-10">
      <h1 className="has-text-centered is-size-6 is-uppercase">
        {t('PERM_HEADING')}
      </h1>

      <article className="icons has-text-centered">
        <i className="sp sp-bth has-text-white is-size-1" />
      </article>

      {either(
        bluetoothAuthorized,

        <article>
          <p className="message success">{t('PERM_CHECK_SUCCESS')}</p>
        </article>,

        <article className="content has-text-centered">
          <p>{t('PERM_TITLE')}</p>
          <p>{t('PERM_SUBTITLE')}</p>
          <ol className="has-text-left">
            <li>{t('PERM_1')}</li>
            <li>{t('PERM_2')}</li>
            <li>{t('PERM_3')}</li>
          </ol>
          {either(
            checkingPermissionError,
            <div className="message error">{t('PERM_CHECK_ERROR')}</div>
          )}
        </article>
      )}

      <article className="actions is-flex">
        <button
          className="button is-primary is-fullwidth is-uppercase mr-5"
          onClick={openSettings}
          disabled={checkingPermission || bluetoothAuthorized}
        >
          {t('PERM_SETTINGS')}
        </button>
      </article>
    </section>
  )
}

export default Permissions
