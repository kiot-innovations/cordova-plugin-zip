import React, { useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { path, pathOr, test, join, values, pick, compose } from 'ramda'

import paths from 'routes/paths'
import SelectField from 'components/SelectField'
import { GET_SITES_INIT, SET_SITE } from 'state/actions/site'

import './Home.scss'
import { either } from 'shared/utils'

const getString = compose(
  join(' '),
  values,
  pick(['site_addr_nm', 'st_addr_lbl'])
)

function Home() {
  const t = useI18n()
  const dispatch = useDispatch()

  const { isFetching, sites, site, error } = useSelector(path(['site']))
  const found = pathOr(0, ['items', 'recordsCount'], sites)
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
      site: value
    }))

    cb(results)
  }

  return (
    <section className="home is-flex has-text-centered full-height">
      {either(
        site != null,
        <Redirect to={paths.PROTECTED.BILL_OF_MATERIALS.path} />
      )}

      <div className="section">
        <span className="sp sp-map has-text-white" />
        <h6 className="is-uppercase mt-20 mb-20">{t('SELECT_SITE')}</h6>

        <SelectField
          onSearch={filterSites}
          onSelect={({ site }) => dispatch(SET_SITE(site))}
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
