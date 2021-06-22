import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { compose, prop } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import { useI18n } from 'shared/i18n'
import { renameKeys, either } from 'shared/utils'

import { FETCH_MODELS_INIT } from 'state/actions/devices'
import {
  HOME_SCREEN_CREATE_SITE,
  SET_SITE,
  GET_SITES_INIT,
  ON_GET_SITE_INFO
} from 'state/actions/site'
import {
  CHECK_APP_UPDATE_INIT,
  CHECK_SSL_CERTS,
  RESET_COMMISSIONING,
  FETCH_STATUS_MESSAGES
} from 'state/actions/global'
import { PVS_FIRMWARE_DOWNLOAD_INIT } from 'state/actions/fileDownloader'
import {
  PVS6_GRID_PROFILE_DOWNLOAD_INIT,
  PVS5_GRID_PROFILE_DOWNLOAD_INIT
} from 'state/actions/gridProfileDownloader'
import { CHECK_BLUETOOTH_STATUS_INIT } from 'state/actions/network'
import { WAKELOCK_RELEASE } from 'state/actions/wakelock'
import paths from 'routes/paths'

import SearchField from 'components/SearchField'

import './Home.scss'

const siteKeysMap = {
  st_addr_lbl: 'address1',
  city_id: 'city',
  lat_deg: 'latitude',
  long_deg: 'longitude',
  pst_zone_id: 'postalCode',
  site_key: 'siteKey',
  site_addr_nm: 'siteName'
}

const setSite = (history, dispatch) => site => {
  dispatch(RESET_COMMISSIONING())
  dispatch(ON_GET_SITE_INFO(site.site_key))
  const siteKeysRenamed = renameKeys(siteKeysMap, site)
  dispatch(SET_SITE(siteKeysRenamed))
  history.push(paths.PROTECTED.BILL_OF_MATERIALS.path)
}

function Home() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(CHECK_BLUETOOTH_STATUS_INIT())
    dispatch(PVS_FIRMWARE_DOWNLOAD_INIT())
    dispatch(PVS6_GRID_PROFILE_DOWNLOAD_INIT())
    dispatch(PVS5_GRID_PROFILE_DOWNLOAD_INIT())
    dispatch(CHECK_APP_UPDATE_INIT())
    dispatch(FETCH_MODELS_INIT())
    dispatch(FETCH_STATUS_MESSAGES())
    dispatch(WAKELOCK_RELEASE())
  }, [dispatch])
  const notFoundText = t('NOT_FOUND')

  const filterSites = (value, onResults) => {
    dispatch(GET_SITES_INIT({ value, onResults }))
  }

  useEffect(() => {
    dispatch(CHECK_SSL_CERTS())
  }, [dispatch])

  const { statusMessages } = useSelector(state => state.global)

  return (
    <section className="home has-text-centered full-height pl-15 pr-15">
      {either(
        statusMessages,
        <section>
          {statusMessages.map((statusMessage, index) => (
            <p
              className="message"
              dangerouslySetInnerHTML={{ __html: statusMessage.content }}
              key={index}
            />
          ))}
        </section>
      )}

      <div className="search">
        <span className="sp sp-map has-text-white" />
        <h6 className="is-uppercase mt-20 mb-20">{t('SELECT_SITE')}</h6>

        <SearchField
          onSearch={filterSites}
          onSelect={compose(setSite(history, dispatch), prop('site'))}
          notFoundText={notFoundText}
        />
      </div>
      <article>
        <p>{t('CS_NOT_FOUND')}</p>
        <Link
          to={paths.PROTECTED.CREATE_SITE.path}
          onClick={() => dispatch(HOME_SCREEN_CREATE_SITE())}
          className="has-text-weight-bold is-uppercase is-size-6"
        >
          <small>{t('CREATE_SITE')}</small>
        </Link>
      </article>
    </section>
  )
}

export default Home
