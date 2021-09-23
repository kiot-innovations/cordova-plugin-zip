import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { concatMap, map, catchError } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import { TAGS } from 'shared/utils'
import {
  FETCH_DEVICES_LIST,
  UPDATE_DEVICES_LIST,
  UPDATE_DEVICES_LIST_ERROR
} from 'state/actions/devices'

export const fetchDeviceListEpic = action$ => {
  return action$.pipe(
    ofType(FETCH_DEVICES_LIST.getType()),
    concatMap(() => {
      const promise = getApiPVS()
        .then(path(['apis', 'devices']))
        .then(api =>
          api.getDevices({
            detailed: false
          })
        )

      return from(promise).pipe(
        map(response =>
          UPDATE_DEVICES_LIST(path(['body', 'devices'], response))
        ),
        catchError(err => {
          Sentry.setTag(TAGS.KEY.ENDPOINT, TAGS.VALUE.DEVICES_GET_DEVICES)
          Sentry.captureMessage(`${err.message} - fetchDevicesList.js`)
          Sentry.captureException(err)
          return of(UPDATE_DEVICES_LIST_ERROR(err))
        })
      )
    })
  )
}
