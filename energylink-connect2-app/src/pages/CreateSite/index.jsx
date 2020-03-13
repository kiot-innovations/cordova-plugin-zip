import TextField from '@sunpower/textfield'
import SearchField from 'components/SearchField'
import { path } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import PlacesAutocomplete from 'react-places-autocomplete'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { geocodeByAddress, getGeocodeData } from 'shared/utils'

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
    siteName: '',
    apt: '',
    city: '',
    state: '',
    postalCode: '',
    address: ''
  })
  const t = useI18n()
  const dispatch = useDispatch()

  const { form, handleSubmit } = useForm({
    onSubmit: onSubmit(dispatch),
    initialValues,
    validate: values => null
  })
  const siteName = useField('siteName', form)
  const apt = useField('apt', form)
  const city = useField('city', form)
  const state = useField('state', form)
  const postalCode = useField('postalCode', form)
  useField('lat', form)
  useField('lng', form)
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
      lat,
      lng,
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
              <SearchField
                onSearch={async newAddress => {
                  getInputProps().onChange({ target: { value: newAddress } })
                  return suggestions
                    .filter(elem => {
                      const country = path(
                        ['terms', elem.terms.length - 1, 'value'],
                        elem
                      )
                      return (
                        //English based language phone
                        country === 'USA' ||
                        country === 'Mexico' ||
                        country === 'Canada' ||
                        //spanish based language phone
                        country === 'EE. UU.' ||
                        country === 'México' ||
                        country === 'Canadá' ||
                        // french based language phone
                        country === 'États-Unis' ||
                        country === 'Mexique'
                      )
                    })
                    .map(elem => ({
                      value: elem.description,
                      label: elem.description
                    }))
                }} //load options
                onSelect={handleSelect} //onchange
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
              <button
                className="button is-primary is-uppercase mb-15"
                type="submit"
              >
                {t('CREATE')}
              </button>

              <Link to={paths.PROTECTED.ROOT.path}>{t('CANCEL')}</Link>
            </div>
          </form>
        </section>
      )}
    </PlacesAutocomplete>
  )
}

export default CreateSite

function onSubmit(dispatch) {
  return console.info
}
