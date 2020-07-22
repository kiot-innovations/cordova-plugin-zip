import React, { useEffect } from 'react'
import * as Sentry from '@sentry/browser'
import { Link, useHistory } from 'react-router-dom'
import { compose, join, map, path, pathOr, pick, prop, values } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import { useI18n } from 'shared/i18n'
import { cleanString, renameKeys } from 'shared/utils'
import { RESET_DISCOVERY } from 'state/actions/devices'
import { RESET_INVENTORY } from 'state/actions/inventory'
import { RESET_PVS_CONNECTION } from 'state/actions/network'
import { RESET_PVS_INFO_STATE } from 'state/actions/pvs'
import { RESET_SITE, SET_SITE } from 'state/actions/site'
import { RESET_LAST_VISITED_PAGE } from 'state/actions/global'
import { FIRMWARE_GET_FILE } from 'state/actions/fileDownloader'
import { getApiSearch } from 'shared/api'

import paths from 'routes/paths'

import SearchField from 'components/SearchField'
import './Home.scss'

const formatAddress = compose(
  join(', '),
  values,
  pick(['st_addr_lbl', 'city_id'])
)

const buildSelectValue = value => ({
  label: formatAddress(value),
  value: value.site_key,
  site: value
})

const accessValue = compose(buildSelectValue, prop('_source'))

const siteKeysMap = {
  st_addr_lbl: 'address1',
  city_id: 'city',
  lat_deg: 'latitude',
  long_deg: 'longitude',
  pst_zone_id: 'postalCode',
  site_key: 'siteKey'
}

const setSite = (history, dispatch) => site => {
  resetCommissioning(dispatch)
  const siteKeysRenamed = renameKeys(siteKeysMap, site)
  dispatch(SET_SITE(siteKeysRenamed))
  history.push(paths.PROTECTED.BILL_OF_MATERIALS.path)
}

const resetCommissioning = dispatch => {
  dispatch(RESET_SITE())
  dispatch(RESET_PVS_INFO_STATE())
  dispatch(RESET_PVS_CONNECTION())
  dispatch(RESET_DISCOVERY())
  dispatch(RESET_INVENTORY())
  dispatch(RESET_LAST_VISITED_PAGE())
}

function Home() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const { access_token } = useSelector(state => state.user.auth)

  useEffect(() => {
    dispatch(FIRMWARE_GET_FILE())
  }, [dispatch])

  const notFoundText = t('NOT_FOUND')

  const filterSites = (inputValue, cb) => {
    const searchStr = cleanString(inputValue)
    getApiSearch(access_token)
      .then(path(['apis', 'default']))
      .then(api =>
        api.get_v1_search_index__indexId_({
          indexId: 'site',
          q: searchStr,
          pg: 1
        })
      )
      .then(pathOr([], ['body', 'items', 'hits']))
      .then(map(accessValue))
      .then(cb)
      .catch(error => {
        Sentry.captureMessage(error)
        cb([])
      })
  }

  return (
    <section className="home has-text-centered full-height pl-15 pr-15">
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
          className="has-text-weight-bold is-uppercase is-size-6"
        >
          <small>{t('CREATE_SITE')}</small>
        </Link>
      </article>
    </section>
  )
}

export default Home
