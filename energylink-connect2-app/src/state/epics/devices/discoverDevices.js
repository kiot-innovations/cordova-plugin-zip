import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getApiPVS } from 'shared/api'
import {
  DISCOVER_COMPLETE,
  DISCOVER_ERROR,
  DISCOVER_UPDATE,
  FETCH_CANDIDATES_COMPLETE
} from 'state/actions/devices'
import { START_DISCOVERY_SUCCESS } from 'state/actions/pvs'

const fetchDiscovery = async () => {
  const swagger = await getApiPVS()
  const res = await Promise.all([
    swagger.apis.devices.getDevices(),
    swagger.apis.discovery.getDiscoveryProgress()
  ])
  const data = res.map(req => req.body)
  return {
    devices: data[0],
    progress: data[1]
  }
}

export const scanDevicesEpic = action$ => {
  const stopPolling$ = action$.pipe(ofType(DISCOVER_COMPLETE.getType()))
  return action$.pipe(
    ofType(
      FETCH_CANDIDATES_COMPLETE.getType(),
      START_DISCOVERY_SUCCESS.getType()
    ),
    switchMap(() =>
      timer(0, 2500).pipe(
        takeUntil(stopPolling$),
        exhaustMap(() =>
          from(fetchDiscovery()).pipe(
            map(response => {
              return pathOr(false, ['progress', 'complete'], response)
                ? DISCOVER_COMPLETE(response)
                : DISCOVER_UPDATE(response)
            }),
            catchError(error => {
              Sentry.setTag('endpoint', 'devices.getDevices')
              Sentry.captureMessage(`${error.message} - discoverDevices.js`)
              Sentry.captureException(error)
              return of(DISCOVER_ERROR('DISCOVERY_ERROR'))
            })
          )
        )
      )
    )
  )
}
