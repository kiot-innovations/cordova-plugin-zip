import TextField from '@sunpower/textfield'
import clsx from 'clsx'
import SearchField from 'components/SearchField'
import { compose, contains, path } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import PlacesAutocomplete from 'react-places-autocomplete'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either, geocodeByAddress, getGeocodeData } from 'shared/utils'
import { SHOW_MODAL } from 'state/actions/modal'
import { CREATE_SITE_INIT, CREATE_SITE_RESET } from 'state/actions/site'

function useGoogleMaps() {
  const [hasGoogleMaps, setGoogleMaps] = useState(!!window.google)
  useEffect(() => {
    setGoogleMaps(!!window.google)
  }, [])
  return hasGoogleMaps
}

function CreateSite() {
  const hasGoogleMaps = useGoogleMaps()
  const [initialValues, setInitialValues] = useState({
    address: ''
  })
  const t = useI18n()
  const dispatch = useDispatch()
  const serverError = useSelector(path(['site', 'saveError']))
  const isSaving = useSelector(path(['site', 'isSaving']))
  const showModal = useSelector(path(['site', 'saveModal']))

  useEffect(() => {
    dispatch(CREATE_SITE_RESET())
  }, [dispatch])

  useEffect(() => {
    if (showModal) {
      dispatch(
        SHOW_MODAL({
          title: t('SITE_CREATED_MODAL_TITLE'),
          componentPath: './CreateSiteSuccessModal.jsx'
        })
      )
    }
  }, [dispatch, showModal, t])

  const { form, handleSubmit } = useForm({
    onSubmit: onSubmit(dispatch),
    initialValues,
    validate: values => {
      const errors = {}

      if (!values.address) {
        errors.address = 'Required'
      }

      if (!values.siteName) {
        errors.siteName = 'Required'
      }

      if (!values.city) {
        errors.city = 'Required'
      }

      if (!values.state) {
        errors.state = 'Required'
      }

      if (!values.postalCode) {
        errors.postalCode = 'Required'
      }
      return errors
    }
  })

  const siteName = useField('siteName', form)
  const apt = useField('apt', form)
  const city = useField('city', form)
  const state = useField('state', form)
  const postalCode = useField('postalCode', form)
  const address = useField('address', form)
  useField('latitude', form)
  useField('longitude', form)
  /**
   * All this handle is just to populate all the fields
   * @param address
   */
  const handleSelect = async address => {
    const geocodeData = await geocodeByAddress(address.value)
    const { parsedData, lat, lng } = getGeocodeData(geocodeData)
    setInitialValues({
      siteName: siteName.input.value,
      city: parsedData.locality || parsedData.political,
      postalCode: parsedData.postal_code,
      state: parsedData.administrative_area_level_1,
      latitude: lat,
      longitude: lng,
      address: address.value
    })
  }
  if (!hasGoogleMaps)
    return (
      <section className="is-flex tile is-vertical section pt-0 fill-parent">
        <h1 className="has-text-centered is-uppercase has-text-weight-bold  pb-20">
          {t('WAITING_GOOGLE_MAPS')}
        </h1>
      </section>
    )
  return (
    <PlacesAutocomplete
      value={initialValues.address}
      onSelect={handleSelect}
      onChange={newAddress =>
        setInitialValues({
          ...initialValues,
          address: newAddress,
          siteName: siteName.input.value,
          city: city.input.locality,
          postalCode: postalCode.input.postal_code,
          state: state.input.administrative_area_level_1
        })
      }
    >
      {({ getInputProps, suggestions }) => (
        <section className="is-flex tile is-vertical section pt-0 fill-parent">
          <h1 className="has-text-centered is-uppercase has-text-weight-bold  pb-20">
            {t('CREATE_SITE')}
          </h1>

          <form onSubmit={handleSubmit} className="mt-20 pt-20">
            <article className="mb-15">
              <label htmlFor="siteName" className="has-text-white">
                {t('SITE_NAME')}
              </label>
              <TextField
                input={siteName.input}
                meta={siteName.meta}
                type="text"
                autoComplete="site_name"
                className="mt-5"
              />
            </article>

            <article className="mb-15">
              <label htmlFor="address" className="has-text-white">
                {t('ADDRESS')}
              </label>
              <div className="control">
                <SearchField
                  onSearch={async newAddress => {
                    const VALID_COUNTRY_STRINGS = [
                      //english based phones
                      'USA',
                      'Mexico',
                      'Canada',
                      //spanish based phones
                      'EE. UU.',
                      'México',
                      'Canadá',
                      //french based phones
                      'États-Unis',
                      'Mexique'
                    ]
                    getInputProps().onChange({ target: { value: newAddress } })
                    return suggestions
                      .filter(elem => {
                        const country = path(
                          ['terms', elem.terms.length - 1, 'value'],
                          elem
                        )
                        return contains(country, VALID_COUNTRY_STRINGS)
                      })
                      .map(elem => ({
                        value: elem.formattedSuggestion.mainText,
                        label: elem.description
                      }))
                  }} //load options
                  onSelect={handleSelect} //onchange
                  className="mt-10"
                />

                {address.meta.touched && address.meta.error && (
                  <span className="error">{address.meta.error}</span>
                )}
              </div>
            </article>

            <div className="is-flex level">
              <article className="mb-15 mr-5">
                <label htmlFor="apt" className="has-text-white">
                  {t('APT')}
                </label>
                <TextField
                  input={apt.input}
                  meta={apt.meta}
                  type="text"
                  autoComplete="apartment"
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
                  type="text"
                  autoComplete="city"
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
                  type="text"
                  autoComplete="state"
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
                  type="text"
                  autoComplete="postal code"
                  className="mt-5"
                />
              </article>
            </div>

            <div className="is-flex file level space-around section pt-0">
              {either(
                serverError && address.meta.touched,
                <div className="message error mb-10">{t(serverError)}</div>
              )}
              <button
                className={clsx('button is-primary is-uppercase mb-20', {
                  'is-loading': isSaving
                })}
                type="submit"
                disabled={isSaving}
              >
                {t('CREATE')}
              </button>

              {either(
                !isSaving,
                <Link
                  className="is-size-7 has-text-weight-bold is-uppercase"
                  to={paths.PROTECTED.ROOT.path}
                >
                  {t('CANCEL')}
                </Link>
              )}
            </div>
          </form>
        </section>
      )}
    </PlacesAutocomplete>
  )
}

export default CreateSite

const onSubmit = dispatch => compose(dispatch, CREATE_SITE_INIT)
