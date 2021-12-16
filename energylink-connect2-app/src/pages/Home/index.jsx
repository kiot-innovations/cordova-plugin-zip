import clsx from 'clsx'
import { isEmpty, length, map, path } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import SiteCard from 'components/SiteCard'
import TextInput from 'components/TextInput'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { renameKeys, either } from 'shared/utils'
import { FETCH_MODELS_INIT } from 'state/actions/devices'
import { PVS_FIRMWARE_DOWNLOAD_INIT } from 'state/actions/fileDownloader'
import {
  CHECK_APP_UPDATE_INIT,
  CHECK_SSL_CERTS,
  RESET_COMMISSIONING,
  FETCH_STATUS_MESSAGES
} from 'state/actions/global'
import {
  PVS6_GRID_PROFILE_DOWNLOAD_INIT,
  PVS5_GRID_PROFILE_DOWNLOAD_INIT
} from 'state/actions/gridProfileDownloader'
import { UPDATE_ARTICLES } from 'state/actions/knowledgeBase'
import { CHECK_BLUETOOTH_STATUS_INIT } from 'state/actions/network'
import {
  HOME_SCREEN_CREATE_SITE,
  SET_SITE,
  ON_GET_SITE_INFO,
  GET_SITES_FILTERING
} from 'state/actions/site'
import { WAKELOCK_RELEASE } from 'state/actions/wakelock'

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
  // because it comes with the form { site, state }
  const siteInner = site.site
  console.info({ siteInner }, 'setSite')
  dispatch(RESET_COMMISSIONING())
  dispatch(ON_GET_SITE_INFO(siteInner.site_key))
  const siteKeysRenamed = renameKeys(siteKeysMap, siteInner)
  dispatch(SET_SITE(siteKeysRenamed))
}

function Home() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const [option, setOption] = useState('')

  const { sites, isFetching, siteRestricted } = useSelector(path(['site']))

  useEffect(() => {
    dispatch(CHECK_BLUETOOTH_STATUS_INIT())
    dispatch(PVS_FIRMWARE_DOWNLOAD_INIT())
    dispatch(PVS6_GRID_PROFILE_DOWNLOAD_INIT())
    dispatch(PVS5_GRID_PROFILE_DOWNLOAD_INIT())
    dispatch(CHECK_APP_UPDATE_INIT())
    dispatch(FETCH_MODELS_INIT())
    dispatch(FETCH_STATUS_MESSAGES())
    dispatch(WAKELOCK_RELEASE())
    dispatch(UPDATE_ARTICLES())
  }, [dispatch])

  const filterSites = event => {
    const value = event.target.value
    setOption(value)
    dispatch(GET_SITES_FILTERING({ value }))
  }

  useEffect(() => {
    dispatch(CHECK_SSL_CERTS())
  }, [dispatch])

  const { statusMessages } = useSelector(state => state.global)
  const longList = length(sites) > 3

  return (
    <section className="home has-text-centered page-height pl-15 pr-15">
      <div className="search">
        <h1 className="mb-10 is-uppercase is-bold">{t('SELECT_SITE')}</h1>
        <TextInput
          onChange={filterSites}
          value={option}
          icon="sp-location"
          loading={isFetching}
          placeholder={t('SITE_SEARCH_PLACEHOLDER')}
        />
        <p className="mb-5 mt-10 has-text-white has-text-centered">
          {either(
            (!isEmpty(option) && !isFetching) || !isEmpty(sites),
            either(
              length(sites) === 1,
              t('SITE_FOUND'),
              t('SITES_FOUND', length(sites))
            ),
            ''
          )}
        </p>
      </div>

      {either(
        statusMessages,
        <section className={clsx('fill-page', { ws: longList })}>
          {statusMessages.map((statusMessage, index) => (
            <p
              className="message"
              dangerouslySetInnerHTML={{ __html: statusMessage.content }}
              key={index}
            />
          ))}

          {either(
            isEmpty(sites),
            <section className="container full-height is-flex">
              <article className="auto">
                <span className="sp sp-map has-text-white" />
                <h1 className="mt-40 pl-20 pr-20 is-size-5">
                  {t(
                    either(
                      isEmpty(option),
                      'SITES_HEADER',
                      siteRestricted ? 'SITE_RESTRICTED' : 'NO_SITES_FOUND'
                    ),
                    option
                  )}
                </h1>
              </article>
            </section>,
            map(renderSiteCard(history, dispatch), sites)
          )}
        </section>
      )}

      <article className="mt-15">
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

/*
 * @param {site}
 * Contains an object ready to be shown in a SearchField component
 * that's why we need to access the underlying site object here
 * */
const renderSiteCard = (history, dispatch) => site => (
  <article className="mb-10" key={site.site.site_key}>
    <SiteCard {...site} setSite={() => setSite(history, dispatch)(site)} />
  </article>
)

export default Home
