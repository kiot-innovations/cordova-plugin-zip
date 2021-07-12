import { path, equals } from 'ramda'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { OPEN_SETTINGS } from 'state/actions/network'
import { REQUEST_LOCATION_PERMISSION_INIT } from 'state/actions/permissions'
import { LOCATION_PERMISSIONS } from 'state/reducers/permissions'

function AskForLocationPermissionModal() {
  const t = useI18n()
  const dispatch = useDispatch()
  const { location } = useSelector(path(['permissions']))
  const deniedAlways = equals(location, LOCATION_PERMISSIONS.DENIED_ALWAYS)
  const requestPermission = () => {
    dispatch(
      deniedAlways ? OPEN_SETTINGS() : REQUEST_LOCATION_PERMISSION_INIT()
    )
  }

  return (
    <section className="has-text-centered">
      <p className="has-text-white has-text-justified">{t('LOCATION_BODY1')}</p>

      {either(
        deniedAlways,
        <p className="has-text-white has-text-justified mt-10">
          {t('LOCATION_BODY2')}
        </p>
      )}

      <button
        className="button is-primary is-fullwidth mt-20"
        onClick={requestPermission}
      >
        <span className="sp-location is-size-6 mr-10" />
        {t(deniedAlways ? 'PERM_SETTINGS' : 'GRANT_PERMISSIONS')}
      </button>
    </section>
  )
}

export default AskForLocationPermissionModal
