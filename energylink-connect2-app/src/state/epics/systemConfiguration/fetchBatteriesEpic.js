import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  GET_STORAGE_ERROR,
  GET_STORAGE_INIT,
  GET_STORAGE_SUCCESS
} from 'state/actions/systemConfiguration'

const fetchBatteries = async () => {
  try {
    const swagger = await getApiPVS()
    const response = await swagger.apis.energyStorageSystems.get()
    return response.body
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchBatteriesEpic = action$ =>
  action$.pipe(
    ofType(GET_STORAGE_INIT.getType()),
    mergeMap(() =>
      from(fetchBatteries()).pipe(
        map(response => GET_STORAGE_SUCCESS(response)),
        catchError(err => {
          Sentry.captureException(err)
          return of(GET_STORAGE_ERROR(err.message))
        })
      )
    )
  )
