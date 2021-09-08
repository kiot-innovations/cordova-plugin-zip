import {
  converge,
  curry,
  path,
  length,
  map as rmap,
  set,
  slice,
  compose,
  clone,
  lensProp,
  when,
  includes,
  pathOr,
  prop
} from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, exhaustMap, map, takeUntil } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiDevice, getApiPVS } from 'shared/api'
import { getMicroinverters } from 'shared/utils'
import {
  DEVICELIST_PROCESSING_COMPLETE,
  DEVICELIST_PROCESSING_ERROR,
  FETCH_DEVICES_LIST,
  UPDATE_DEVICES_LIST_ERROR,
  WAIT_FOR_DEVICELIST_PROCESSING
} from 'state/actions/devices'
import {
  RMA_REMOVE_DEVICES_ERROR,
  RMA_REMOVE_DEVICES,
  RMA_REMOVE_DEVICES_SUCCESS
} from 'state/actions/rma'
import { EMPTY_ACTION } from 'state/actions/share'

const updateDeviceListProgress = progress => {
  const percent = prop('percent', progress)
  const result = prop('result', progress)
  const code = prop('code', progress)

  if (percent === 100 && result === 'succeed')
    return DEVICELIST_PROCESSING_COMPLETE(progress)

  if (result === 'error') {
    return DEVICELIST_PROCESSING_ERROR(code)
  }

  return EMPTY_ACTION()
}

const getAccessToken = path(['user', 'auth', 'access_token'])
const getSelectedPVS = path(['rma', 'pvs'])
const getAllInverters = compose(getMicroinverters, path(['devices', 'found']))

const bulkSize = 10

/**
 * Perform bulk deletes in EDP and the PVS
 * @todo: This function is temporal until we have an endpoint in EDP to make bulk deletes
 */
const postDeleteDevices = curry(
  async (accessToken, dataloggerid, allInverters, invertersToDelete) => {
    let success = [],
      rejected = []
    try {
      const edpDelete = path(
        ['apis', 'device', 'deviceRemoveDeviceByDeviceIdV2'],
        await getApiDevice(accessToken)
      )
      const startClaim = path(
        ['apis', 'devices', 'startClaim'],
        await getApiPVS()
      )

      for (
        let start = 0;
        start <= length(invertersToDelete);
        start += bulkSize
      ) {
        const invertersToSend = slice(
          start,
          start + bulkSize,
          invertersToDelete
        )

        const result = await Promise.allSettled(
          invertersToSend.map(deviceid => edpDelete({ deviceid, dataloggerid }))
        )

        result.forEach(({ status }, pos) =>
          status === 'rejected'
            ? rejected.push(invertersToSend[pos])
            : success.push(invertersToSend[pos])
        )
      }

      const pvsRequestBody = rmap(
        compose(
          when(
            ({ SERIAL }) => includes(SERIAL, success),
            set(lensProp('OPERATION'), 'delete')
          ),
          set(lensProp('OPERATION'), 'noop'),
          clone
        )
      )(allInverters)

      if (length(success)) {
        await startClaim({ id: 1 }, { requestBody: pvsRequestBody })
      }
      return { status: length(rejected) < 1, rejected }
    } catch (error) {
      Sentry.captureException(error)
      return { status: false, rejected }
    }
  }
)

const deleteDevices = converge(postDeleteDevices, [
  getAccessToken,
  getSelectedPVS,
  getAllInverters
])

export const removeDevicesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(RMA_REMOVE_DEVICES.getType()),
    exhaustMap(({ payload }) =>
      from(deleteDevices(state$.value)(payload)).pipe(
        map(({ status, rejected }) => {
          return status
            ? RMA_REMOVE_DEVICES_SUCCESS()
            : RMA_REMOVE_DEVICES_ERROR(rejected)
        }),
        catchError(err => {
          Sentry.captureException(err)
          return of(RMA_REMOVE_DEVICES_ERROR([]))
        })
      )
    )
  )
}

export const triggerDeviceListPollingEpic = action$ => {
  return action$.pipe(
    ofType(
      RMA_REMOVE_DEVICES_SUCCESS.getType(),
      RMA_REMOVE_DEVICES_ERROR.getType()
    ),
    map(() => WAIT_FOR_DEVICELIST_PROCESSING()),
    catchError(err => {
      Sentry.captureException(err)
      return of(UPDATE_DEVICES_LIST_ERROR())
    })
  )
}

export const waitForDeviceListProcessingEpic = action$ => {
  const stopPolling$ = action$.pipe(
    ofType(
      DEVICELIST_PROCESSING_COMPLETE.getType(),
      DEVICELIST_PROCESSING_ERROR.getType()
    )
  )

  return action$.pipe(
    ofType(WAIT_FOR_DEVICELIST_PROCESSING.getType()),
    exhaustMap(() =>
      timer(0, 2500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => {
          const promise = getApiPVS()
            .then(path(['apis', 'devices']))
            .then(api => api.getClaim())
          return from(promise).pipe(
            map(response => {
              const progress = pathOr([], ['body'], response)
              return updateDeviceListProgress(progress)
            }),
            catchError(() => {
              Sentry.captureException('Error during device list processing')
              return of(UPDATE_DEVICES_LIST_ERROR())
            })
          )
        })
      )
    )
  )
}

export const retriggerDevicesListEpic = action$ => {
  return action$.pipe(
    ofType(DEVICELIST_PROCESSING_COMPLETE.getType()),
    map(FETCH_DEVICES_LIST),
    catchError(err => {
      Sentry.captureException(err)
      return of(UPDATE_DEVICES_LIST_ERROR())
    })
  )
}
