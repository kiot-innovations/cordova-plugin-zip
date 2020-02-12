import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, flatMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  GET_STORAGE_ERROR,
  GET_STORAGE_INIT,
  GET_STORAGE_SUCCESS
} from 'state/actions/systemConfiguration'

const fetchBatteries = async () => {
  const swagger = await getApiPVS()
  try {
    const response = await swagger.apis.energyStorageSystems.get()
    return response.body
  } catch (e) {
    throw new Error(e)
  }
}

const fetchBatteriesEpic = action$ =>
  action$.pipe(
    ofType(GET_STORAGE_INIT.getType()),
    flatMap(() =>
      from(fetchBatteries()).pipe(
        map(response => GET_STORAGE_SUCCESS(response)),
        catchError(err => of(GET_STORAGE_ERROR.asError(err.message)))
      )
    )
  )

export default fetchBatteriesEpic
