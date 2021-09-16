import * as Sentry from '@sentry/browser'
import { pathOr, path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map as rxjsMap } from 'rxjs/operators'

import { getApiPVS } from 'shared/api'
import { either, isStorageDevice } from 'shared/utils'
import {
  RMA_REMOVE_STORAGE,
  RMA_REMOVE_STORAGE_ERROR,
  RMA_REMOVE_STORAGE_SUCCESS
} from 'state/actions/rma'

const getDevices = pathOr([], ['value', 'devices', 'found'])

const clearStorageFromPVSPayload = state$ => {
  const devices = getDevices(state$)
  return devices.map(device => {
    return {
      OPERATION: either(isStorageDevice(device), 'delete', 'noop'),
      MODEL: device.MODEL,
      SERIAL: device.SERIAL,
      TYPE: device.TYPE
    }
  })
}

const removeStorageFromPVS = async state$ => {
  const startClaim = path(['apis', 'devices', 'startClaim'], await getApiPVS())
  const requestBody = clearStorageFromPVSPayload(state$)
  const startClaimResponse = await startClaim({ id: 1 }, { requestBody })
  return startClaimResponse
}

export const rmaRemoveStorageEpic = (action$, state$) => {
  return action$.pipe(
    ofType(RMA_REMOVE_STORAGE.getType()),
    exhaustMap(() =>
      from(removeStorageFromPVS(state$)).pipe(
        rxjsMap(RMA_REMOVE_STORAGE_SUCCESS),
        catchError(error => {
          Sentry.addBreadcrumb({
            data: {
              path: window.location.hash,
              environment: process.env.REACT_APP_FLAVOR
            },
            message: error.message,
            level: Sentry.Severity.Warning
          })
          Sentry.captureException(error)
          return of(RMA_REMOVE_STORAGE_ERROR())
        })
      )
    )
  )
}
