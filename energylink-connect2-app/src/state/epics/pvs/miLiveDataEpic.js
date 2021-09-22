import {
  compose,
  map as mapRamda,
  path,
  pathOr,
  multiply,
  filter,
  reject
} from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, exhaustMap, takeUntil, map } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import { isMicroinverter, TAGS } from 'shared/utils'
import {
  MI_DATA_STOP_POLLING,
  MI_DATA_START_POLLING,
  MI_DATA_SUCCESS,
  MI_DATA_ERROR
} from 'state/actions/pvs'

const transformDevice = device => ({
  sn: device.SERIAL,
  power: multiply(1000, device.p_3phsum_kw || 0),
  state: device.STATE
})

const isUnclaimed = device => device.state === 'discovered'

const getData = compose(
  reject(isUnclaimed),
  mapRamda(transformDevice),
  filter(isMicroinverter),
  pathOr([], ['body', 'devices'])
)

export const miLiveDataEpic = action$ => {
  const stopPolling$ = action$.pipe(ofType(MI_DATA_STOP_POLLING))

  return action$.pipe(
    ofType(MI_DATA_START_POLLING.getType()),
    exhaustMap(() =>
      timer(0, 15000).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() => {
          const promise = getApiPVS()
            .then(path(['apis', 'devices']))
            .then(api => api.getDevices())

          return from(promise).pipe(
            map(getData),
            map(MI_DATA_SUCCESS),
            catchError(error => {
              Sentry.setTag(TAGS.KEY.ENDPOINT, TAGS.VALUE.DEVICES_GET_DEVICES)
              Sentry.captureMessage(`${error.message} - miLiveDataEpic.js`)
              Sentry.captureException(error)
              return of(MI_DATA_ERROR(error))
            })
          )
        })
      )
    )
  )
}
