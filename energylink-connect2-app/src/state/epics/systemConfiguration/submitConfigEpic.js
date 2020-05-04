import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, mergeMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { path } from 'ramda'
import {
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR,
  SUBMIT_EXPORTLIMIT,
  SUBMIT_GRIDVOLTAGE
} from 'state/actions/systemConfiguration'

export const submitGridProfileEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.set(
            { id: 1 },
            {
              requestBody: {
                ID: payload.gridProfile,
                lazy: payload.lazyGridProfile
              }
            }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_EXPORTLIMIT(payload)
            : SUBMIT_CONFIG_ERROR('Error while setting grid profile')
        ),
        catchError(err =>
          of(SUBMIT_CONFIG_ERROR('Error while setting grid profile'))
        )
      )
    })
  )
}

export const submitExportLimitEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_EXPORTLIMIT.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.setGridExportLimit(
            { id: 1 },
            { requestBody: { Limit: payload.exportLimit } }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_GRIDVOLTAGE(payload)
            : SUBMIT_CONFIG_ERROR('Error while setting export limit')
        ),
        catchError(err =>
          of(SUBMIT_CONFIG_ERROR('Error while setting export limit'))
        )
      )
    })
  )
}

export const submitGridVoltageEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_GRIDVOLTAGE.getType()),
    mergeMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.setGridVoltage(
            { id: 1 },
            { requestBody: { body: { grid_voltage: payload.gridVoltage } } }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.status === 200
            ? SUBMIT_CONFIG_SUCCESS(response)
            : SUBMIT_CONFIG_ERROR('Error while setting grid voltage')
        ),
        catchError(err =>
          of(SUBMIT_CONFIG_ERROR('Error while setting grid voltage'))
        )
      )
    })
  )
}
