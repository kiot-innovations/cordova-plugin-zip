import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useI18n } from 'shared/i18n'
import { path, pathOr, test, join, values, pick, prop, compose } from 'ramda'

import paths from 'routes/paths'
import SelectField from 'components/SelectField'
import { GET_SITES_INIT, SET_SITE } from 'state/actions/site'

import './Home.scss'
import { either } from 'shared/utils'

const getString = compose(
  join(' '),
  values,
  pick(['site_addr_nm', 'st_addr_lbl']),
  prop('_source')
)

const buildSite = site => ({
  address: `${site.site_addr_nm} ${site.st_addr_lbl}`,
  city: site.city_id,
  state: site.st_id,
  lat_deg: site.lat_deg,
  long_deg: site.long_deg
})

const setSite = (history, dispatch) => site => {
  dispatch(SET_SITE(site))
  history.push(paths.PROTECTED.BILL_OF_MATERIALS.path)
}

function Home() {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()

  const isFetching = useSelector(state => state.site.isFetching)
  const sites = useSelector(state => state.site.sites)
  const error = useSelector(state => state.site.error)

  const found = pathOr(0, ['items', 'totalSitesFound'], sites)
  const errorMessage = path(['data', 'message'], error)

  useEffect(() => {
    dispatch(GET_SITES_INIT())
  }, [dispatch])

  const notFoundText = t('NOT_FOUND')

  const filterSites = (inputValue, cb) => {
    const sitesValues = pathOr([], ['items', 'hits'], sites)

    const matchValue = compose(test(new RegExp(inputValue, 'ig')), getString)
    const results = sitesValues.filter(matchValue).map(value => ({
      label: getString(value),
      value: getString(value),
      site: buildSite(value._source)
    }))

    cb(results)
  }

  return (
    <section className="home is-flex has-text-centered full-height">
      <div className="section">
        <span className="sp sp-map has-text-white" />
        <h6 className="is-uppercase mt-20 mb-20">{t('SELECT_SITE')}</h6>

        <SelectField
          onSearch={filterSites}
          onSelect={compose(setSite(history, dispatch), prop('site'))}
          notFoundText={notFoundText}
        />

        <div className="message mb-10 mt-10">
          <p className="pl-20 pr-20">
            {isFetching ? t('FETCHING_SITES') : t('FOUND_SITES', found)}
          </p>
        </div>

        {either(
          error,
          <div className="message error mb-10 mt-10">
            <p className="pl-20 pr-20"> {t('FETCH_SITE_ERROR')} </p>
            <p className="pl-20 pr-20"> {errorMessage} </p>
          </div>
        )}
      </div>
      <section>
        <p>{t('CS_NOT_FOUND')}</p>
        <Link
          to={paths.PROTECTED.CREATE_SITE.path}
          className="link is-uppercase"
        >
          <small>{t('CREATE_SITE')}</small>
        </Link>
      </section>
    </section>
  )
}

export default Home
