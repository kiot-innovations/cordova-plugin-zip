import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  GET_RSE_ERROR,
  GET_RSE_INIT,
  GET_RSE_SUCCESS
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
    exhaustMap(() =>
      from(fetchRSE()).pipe(
        map(GET_RSE_SUCCESS),
        catchError(error => of(GET_RSE_ERROR(error.message)))
      )
    )
  )
}
