import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  DISCOVER_COMPLETE,
  DISCOVER_ERROR,
  DISCOVER_INIT,
  DISCOVER_UPDATE
} from 'state/actions/devices'

const fetchDiscovery = () =>
  new Promise(async (resolve, reject) => {
    const swagger = await getApiPVS()
    try {
      const res = await Promise.all([
        swagger.apis.devices.getDevices(),
        swagger.apis.discovery.getDiscoveryProgress()
      ])
      const data = res.map(req => req.body)
      resolve({
        devices: data[0],
        progress: data[1]
      })
    } catch (e) {
      console.error('ERROR', e)
    }
  })

const initDeviceDiscovery = async () => {
  const swagger = await getApiPVS()
  return swagger.apis.discovery.startDiscovery()
}

const scanDevicesEpic = action$ => {
  const stopPolling$ = action$.pipe(ofType(DISCOVER_COMPLETE.getType()))

  return action$.pipe(
    ofType(DISCOVER_INIT.getType()),
    tap(initDeviceDiscovery),
    switchMap(() =>
      timer(0, 250).pipe(
        takeUntil(stopPolling$),
        switchMap(() =>
          from(fetchDiscovery()).pipe(
            switchMap(async response =>
              pathOr(false, ['progress', 'complete', response])
                ? DISCOVER_COMPLETE(pathOr([], ['devices'], response))
                : DISCOVER_UPDATE(pathOr([], ['devices'], response))
            ),
            catchError(error => of(DISCOVER_ERROR.asError(error.message)))
          )
        )
      )
    )
  )
}
export default scanDevicesEpic
