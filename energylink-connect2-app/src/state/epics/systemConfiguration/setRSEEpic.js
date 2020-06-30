import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  GET_RSE_INIT,
  SET_RSE_ERROR,
  SET_RSE_INIT,
  SET_RSE_STATUS,
  SET_RSE_SUCCESS
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
    Sentry.captureException(e)
    throw new Error('SET_RSE_ERROR')
  }
}

export const setRSEEpic = action$ => {
  return action$.pipe(
    ofType(SET_RSE_INIT.getType()),
    mergeMap(({ payload }) =>
      from(setRSE(payload)).pipe(
        map(response =>
          response.error
            ? SET_RSE_ERROR(response.error)
            : SET_RSE_STATUS(response)
        ),
        catchError(error => of(SET_RSE_ERROR(error.message)))
      )
    )
  )
}

export const pollRSEEpic = (action$, state$) => {
  let currentProgress = 0

  state$.subscribe(state => {
    currentProgress = state.systemConfiguration.rse.data.progress || 0
  })

  const stopPolling$ = action$.pipe(ofType(SET_RSE_SUCCESS.getType()))

  return action$.pipe(
    ofType(SET_RSE_STATUS.getType()),
    switchMap(() =>
      timer(500, 3500).pipe(
        takeUntil(stopPolling$),
        map(timeLapsed =>
          currentProgress < 100 || timeLapsed < 5
            ? GET_RSE_INIT(true)
            : SET_RSE_SUCCESS()
        )
      )
    )
  )
}
