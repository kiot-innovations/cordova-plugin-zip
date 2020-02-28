import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, mergeMap, map, takeWhile } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  SET_RSE_INIT,
  SET_RSE_STATUS,
  SET_RSE_SUCCESS,
  SET_RSE_ERROR,
  GET_RSE_INIT
} from 'state/actions/systemConfiguration'

const setRSE = async powerProduction => {
  try {
    const swagger = await getApiPVS()
    const res = await swagger.apis.powerProduction.setPowerProduction(
      { id: 1 },
      { requestBody: { powerProduction } }
    )
    return res.body
  } catch (e) {
    throw new Error('Setting RSE error')
  }
}

export const setRSEEpic = action$ => {
  return action$.pipe(
    ofType(SET_RSE_INIT.getType()),
    mergeMap(({ payload }) => {
      return from(setRSE(payload)).pipe(
        map(response =>
          response.error
            ? SET_RSE_ERROR(response.error)
            : SET_RSE_STATUS(response)
        ),
        catchError(error => {
          return of(SET_RSE_ERROR(error.message))
        })
      )
    })
  )
}

export const pollRSEEpic = (action$, state$) => {
  let currentProgress = 0

  state$.subscribe(state => {
    currentProgress = state.systemConfiguration.rse.pollProgress
  })

  return action$.pipe(
    ofType(SET_RSE_STATUS.getType()),
    mergeMap(() =>
      timer(0, 1000).pipe(
        map(() => {
          console.info(currentProgress)
          return currentProgress < 100 ? GET_RSE_INIT(true) : SET_RSE_SUCCESS()
        }),
        takeWhile(() => currentProgress < 100)
      )
    )
  )
}
