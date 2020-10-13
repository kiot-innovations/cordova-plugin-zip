import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { catchError, delay, exhaustMap, map } from 'rxjs/operators'
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
  includes
} from 'ramda'
import {
  RMA_REMOVE_DEVICES_ERROR,
  RMA_REMOVE_DEVICES,
  RMA_REMOVE_DEVICES_SUCCESS
} from 'state/actions/rma'
import {
  FETCH_DEVICES_LIST,
  WAIT_FOR_DL_PROCESSING
} from 'state/actions/devices'
import { getApiDevice, getApiPVS } from 'shared/api'
import { filterInverters } from 'shared/utils'

const getAccessToken = path(['user', 'auth', 'access_token'])
const getSelectedPVS = path(['rma', 'pvs'])
const getAllInverters = compose(filterInverters, path(['devices', 'found']))

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
        ['apis', 'device', 'deviceRemoveDeviceByDeviceId'],
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
          rmap(
            deviceid => edpDelete({ deviceid, dataloggerid }),
            invertersToSend
          )
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
      return { status: !(length(rejected) > 0), rejected }
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

export const retriggerDevicesListEpic = action$ => {
  return action$.pipe(
    ofType(
      RMA_REMOVE_DEVICES_SUCCESS.getType(),
      RMA_REMOVE_DEVICES_ERROR.getType()
    ),
    map(WAIT_FOR_DL_PROCESSING),
    delay(3000),
    map(FETCH_DEVICES_LIST),
    catchError(err => {
      Sentry.captureException(err)
    })
  )
}
