import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import paths from 'routes/paths'
import SelectField from 'components/SelectField'
import './Home.scss'

function Home() {
  const t = useI18n()

  const [toSiteOverview, setToSiteOverview] = useState(false)

  const options = [
    { value: '1', label: '555 Home Street, San Jose, Ca' },
    { value: '2', label: '555 Home Street, Tulsa, Ok' }
  ]
  const notFoundText = t('NOT_FOUND')

  const filterRemote = (inputValue, cb) => {
    const no = options.filter(i =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    )

    setTimeout(() => {
      cb(no)
    }, 1000)
  }

  return (
    <section className="home is-flex has-text-centered fill-parent">
      {toSiteOverview ? (
        <Redirect to={paths.PROTECTED.BILL_OF_MATERIALS.path} />
      ) : null}
      <div className="section">
        <span className="sp sp-map has-text-white" />
        <h6 className="is-uppercase mt-20 mb-20">{t('SELECT_SITE')}</h6>
        <SelectField
          onSearch={filterRemote}
          onSelect={() => setToSiteOverview(true)}
          notFoundText={notFoundText}
        />
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
