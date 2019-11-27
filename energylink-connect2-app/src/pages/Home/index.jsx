import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from 'shared/i18n'
import Swagger from 'swagger-client'
import paths from 'routes/paths'
import SelectField from 'components/SelectField'
import './Home.scss'

Swagger('http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-auth').then(
  client => {
    client.apis.default.get_v1_auth_user().then(
      function(result) {},
      function(err) {}
    )
  }
)

Swagger(
  'http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-device'
).then(client => {})

Swagger(
  'http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-party'
).then(client => {})

Swagger(
  'http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-search'
).then(client => {})

Swagger(
  'http://consolemock.p2e.io:10011/v1/edp/swagger/edp-api-site'
).then(client => {})

function Home() {
  const t = useI18n()

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
    }, 2000)
  }

  return (
    <section className="home is-flex has-text-centered fill-parent">
      <div className="section">
        <span className="sp sp-map has-text-white" />
        <h6 className="is-uppercase mt-20 mb-20">{t('SELECT_SITE')}</h6>
        <SelectField
          onSearch={filterRemote}
          onSelect={console.info}
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
