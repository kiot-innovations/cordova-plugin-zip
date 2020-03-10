import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { from, of, timer } from 'rxjs'
import { catchError, switchMap, takeUntil } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import {
  DISCOVER_COMPLETE,
  DISCOVER_ERROR,
  FETCH_CANDIDATES_COMPLETE,
  DISCOVER_UPDATE
} from 'state/actions/devices'

const fetchDiscovery = async () => {
  try {
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
  } catch (e) {
    throw new Error('DISCOVERY_ERROR')
  }
}

export const scanDevicesEpic = action$ => {
  const stopPolling$ = action$.pipe(ofType(DISCOVER_COMPLETE.getType()))

  return action$.pipe(
    ofType(FETCH_CANDIDATES_COMPLETE.getType(), DISCOVER_ERROR.getType()),
    switchMap(() =>
      timer(0, 2500).pipe(
        takeUntil(stopPolling$),
        switchMap(() =>
          from(fetchDiscovery()).pipe(
            switchMap(async response =>
              pathOr(false, ['progress', 'complete'], response)
                ? DISCOVER_COMPLETE(response)
                : DISCOVER_UPDATE(response)
            ),
            catchError(error => of(DISCOVER_ERROR.asError(error.message)))
          )
        )
      )
    )
  )
}
