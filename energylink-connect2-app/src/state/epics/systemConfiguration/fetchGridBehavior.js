import * as Sentry from '@sentry/browser'
import { prop } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import {
  FETCH_GRID_BEHAVIOR,
  FETCH_GRID_BEHAVIOR_ERR,
  FETCH_GRID_BEHAVIOR_SUCCESS
} from 'state/actions/systemConfiguration'

const fetchGridBehavior = async () => {
  try {
    const swagger = await getApiPVS()
    const res = await Promise.all([
      swagger.apis.grid.getGridProfiles(),
      swagger.apis.grid.getGridExportLimit(),
      swagger.apis.grid.getGridVoltage()
    ])
    const [gridProfiles, exportLimit, gridVoltage] = res.map(prop('body'))
    return { gridProfiles, exportLimit, gridVoltage }
  } catch (e) {
    throw new Error('Fetching Grid Behavior Options error')
  }
}

export const fetchGridBehaviorEpic = action$ => {
  return action$.pipe(
    ofType(FETCH_GRID_BEHAVIOR.getType()),
    switchMap(() =>
      from(fetchGridBehavior()).pipe(
        switchMap(async response => FETCH_GRID_BEHAVIOR_SUCCESS(response)),
        catchError(error => {
          Sentry.captureException(error)
          return of(FETCH_GRID_BEHAVIOR_ERR(error.message))
        })
      )
    )
  )
}
