import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { useForm, useField } from 'react-final-form-hooks'
import TextField from '@sunpower/textfield'
import SelectField from 'components/SelectField'
import { paths } from 'routes/paths'

function CreateSite() {
  const t = useI18n()
  const dispatch = useDispatch()

  const { form, handleSubmit } = useForm({
    onSubmit: onSubmit(dispatch),
    validate: values => null
  })

  const siteName = useField('siteName', form)
  const apt = useField('apt', form)
  const city = useField('city', form)
  const state = useField('state', form)
  const postalCode = useField('postalCode', form)

  return (
    <section className="is-flex tile is-vertical section pt-0">
      <h1 className="has-text-centered is-uppercase has-text-weight-bold mb-50 pb-15">
        {t('CREATE_SITE')}
      </h1>

      <form onSubmit={handleSubmit}>
        <article className="mb-15">
          <label htmlFor="siteName" className="has-text-white">
            {t('SITE_NAME')}
          </label>
          <TextField
            input={siteName.input}
            meta={siteName.meta}
            type="email"
            autoComplete="email"
            className="mt-5"
          />
        </article>

        <article className="mb-15">
          <label htmlFor="address" className="has-text-white">
            {t('ADDRESS')}
          </label>
          <SelectField
            onSearch={console.info}
            onSelect={console.info}
            className="mt-10"
          />
        </article>

        <div className="is-flex level">
          <article className="mb-15 mr-5">
            <label htmlFor="apt" className="has-text-white">
              {t('APT')}
            </label>
            <TextField
              input={apt.input}
              meta={apt.meta}
              type="email"
              autoComplete="email"
              className="mt-5"
            />
          </article>

          <article className="mb-15 ml-5">
            <label htmlFor="city" className="has-text-white">
              {t('CITY')}
            </label>
            <TextField
              input={city.input}
              meta={city.meta}
              type="email"
              autoComplete="email"
              className="mt-5"
            />
          </article>
        </div>

        <div className="is-flex level">
          <article className="mb-15 mr-5">
            <label htmlFor="state" className="has-text-white">
              {t('STATE')}
            </label>
            <TextField
              input={state.input}
              meta={state.meta}
              type="email"
              autoComplete="email"
              className="mt-5"
            />
          </article>

          <article className="mb-15 ml-5">
            <label htmlFor="postalCode" className="has-text-white">
              {t('POSTAL_CODE')}
            </label>
            <TextField
              input={postalCode.input}
              meta={postalCode.meta}
              type="email"
              autoComplete="email"
              className="mt-5"
            />
          </article>
        </div>

        <div className="is-flex file level space-around section pt-0">
          <button
            className="button is-primary is-uppercase mb-15"
            type="submit"
          >
            {t('CREATE')}
          </button>

          <Link to={paths.PROTECTED.ROOT}>{t('CANCEL')}</Link>
        </div>
      </form>
    </section>
  )
}

export default CreateSite

function onSubmit(dispatch) {
  return values => null
}
