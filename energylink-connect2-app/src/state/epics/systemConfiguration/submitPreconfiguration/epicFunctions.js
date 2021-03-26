import { getApiPVS } from 'shared/api'
import { path } from 'ramda'

export const submitGridProfile = ({ gridProfile, lazyGridProfile }) => {
  return getApiPVS()
    .then(path(['apis', 'grid']))
    .then(api =>
      api.set(
        { id: 1 },
        {
          requestBody: {
            ID: gridProfile,
            lazy: lazyGridProfile
          }
        }
      )
    )
}

export const submitMeterConfigurations = ({ metaData }) =>
  getApiPVS()
    .then(path(['apis', 'meta']))
    .then(api =>
      api.setMetaData({ id: 1 }, { requestBody: { metaData: metaData } })
    )
