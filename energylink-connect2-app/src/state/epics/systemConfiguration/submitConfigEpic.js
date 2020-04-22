import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { prop } from 'ramda'
import { findProp } from 'shared/utils'
import {
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR
} from 'state/actions/systemConfiguration'

const submitConfiguration = async payload => {
  try {
    const swagger = await getApiPVS()
    const res = await Promise.all([
      swagger.apis.grid.set(
        { id: 1 },
        {
          requestBody: {
            ID: payload.gridProfile,
            lazy: payload.lazyGridProfile
          }
        }
      ),
      swagger.apis.grid.setGridExportLimit(
        { id: 1 },
        { requestBody: { Limit: payload.exportLimit } }
      ),
      swagger.apis.grid.setGridVoltage(
        { id: 1 },
        { requestBody: { grid_voltage: payload.gridVoltage } }
      ),
      swagger.apis.commission.sendConfig(
        { id: 1 },
        {
          requestBody: {
            metaData: { site_key: payload.siteKey, devices: payload.devices }
          }
        }
      )
    ])
    const [
      setGridProfiles,
      setExportLimit,
      setGridVoltage,
      sendConfigObject
    ] = res.map(prop('body'))
    return { setGridProfiles, setExportLimit, setGridVoltage, sendConfigObject }
  } catch (e) {
    console.error(e)
  }
}

export const submitConfigurationEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    switchMap(({ payload }) =>
      from(submitConfiguration(payload)).pipe(
        switchMap(async response =>
          findProp('error', response)
            ? SUBMIT_CONFIG_ERROR(response)
            : SUBMIT_CONFIG_SUCCESS(response)
        ),
        catchError(error => of(SUBMIT_CONFIG_ERROR(error.message)))
      )
    )
  )
}
