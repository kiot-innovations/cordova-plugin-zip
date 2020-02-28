import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  GET_RSE_INIT,
  GET_RSE_SUCCESS,
  GET_RSE_ERROR
} from 'state/actions/systemConfiguration'

const fetchRSE = async () => {
  try {
    const swagger = await getApiPVS()
    const res = await swagger.apis.powerProduction.getPowerProduction()
    return res.body
  } catch (e) {
    throw new Error('GET_RSE_ERROR')
  }
}

export const fetchRSEEpic = action$ => {
  return action$.pipe(
    ofType(GET_RSE_INIT.getType()),
    switchMap(() =>
      from(fetchRSE()).pipe(
        switchMap(async response => GET_RSE_SUCCESS(response)),
        catchError(error => of(GET_RSE_ERROR(error.message)))
      )
    )
  )
}
