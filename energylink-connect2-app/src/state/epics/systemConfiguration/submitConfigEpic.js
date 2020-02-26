import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { prop } from 'ramda'
import {
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR
} from 'state/actions/systemConfiguration'

const submitConfiguration = async payload => {
  try {
    const swagger = await getApiPVS()
    const res = await Promise.all([
      swagger.apis.grid.set({
        ID: payload.gridProfile,
        lazy: payload.lazyGridProfile
      }),
      swagger.apis.grid.setGridExportLimit({ Limit: payload.exportLimit }),
      swagger.apis.grid.setGridVoltage({ grid_voltage: payload.gridVoltage }),
      swagger.apis.config.sendConfigObject({ site_key: payload.siteKey })
    ])
    const [setGridProfiles, setExportLimit, setGridVoltage] = res.map(
      prop('body')
    )
    return { setGridProfiles, setExportLimit, setGridVoltage }
  } catch (e) {
    console.error(e)
  }
}

export const submitConfigurationEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    switchMap(({ payload }) =>
      from(submitConfiguration(payload)).pipe(
        switchMap(async response => SUBMIT_CONFIG_SUCCESS(response)),
        catchError(error => of(SUBMIT_CONFIG_ERROR(error.message)))
      )
    )
  )
}
