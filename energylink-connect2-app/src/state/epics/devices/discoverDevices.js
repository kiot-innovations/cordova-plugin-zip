import { ofType } from 'redux-observable'
import { from, timer } from 'rxjs'
import { switchMap, takeUntil, tap } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  DISCOVER_COMPLETE,
  DISCOVER_INIT,
  DISCOVER_UPDATE
} from 'state/actions/devices'

const fetchDiscovery = () =>
  new Promise(async (resolve, reject) => {
    const swagger = await getApiPVS()
    swagger.apis.discovery
      .getDiscoveryProgress()
      .then(resolve)
      .catch(reject)
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
      timer(0, 500).pipe(
        takeUntil(stopPolling$),
        switchMap(() =>
          from(fetchDiscovery()).pipe(
            switchMap(async response => {
              return response.data.complete
                ? DISCOVER_COMPLETE(response.data.progress)
                : DISCOVER_UPDATE(response.data.progress)
            })
          )
        )
      )
    )
  )
}
export default scanDevicesEpic
