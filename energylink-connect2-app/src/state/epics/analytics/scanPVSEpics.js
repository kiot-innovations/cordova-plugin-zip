import { ofType } from 'redux-observable'
import { map, switchMap, take } from 'rxjs/operators'
import {
  CONNECT_PVS_CAMERA,
  CONNECT_PVS_MANUALLY,
  SCANNING_START
} from 'state/actions/analytics'
import { scanPVS } from 'shared/analytics'
import {
  CONNECT_PVS_VIA_BLE,
  PVS_CONNECTION_SUCCESS
} from 'state/actions/network'
import { EMPTY } from 'rxjs'

const enterSNManuallyEpic = action$ =>
  action$.pipe(
    ofType(CONNECT_PVS_MANUALLY.getType()),
    switchMap(({ payload }) =>
      action$.pipe(
        ofType(PVS_CONNECTION_SUCCESS.getType()),
        take(1),
        map(() =>
          scanPVS(
            { entryMethod: 'Manual', pvsSN: payload },
            'User entered PVS SN manually'
          )
        )
      )
    )
  )

const connectedViaBLE = action$ =>
  action$.pipe(
    ofType(CONNECT_PVS_VIA_BLE.getType()),
    switchMap(({ payload: { name } }) =>
      action$.pipe(
        ofType(PVS_CONNECTION_SUCCESS.getType()),
        take(1),
        map(() => scanPVS({ pvsSN: name, entryMethod: 'Bluetooth' }))
      )
    )
  )

const scanPVSCameraEpic = action$ =>
  action$.pipe(
    ofType(CONNECT_PVS_CAMERA.getType()),
    switchMap(({ payload }) =>
      action$.pipe(
        ofType(PVS_CONNECTION_SUCCESS.getType()),
        take(1),
        map(() =>
          scanPVS(
            {
              entryMethod: 'QR Code',
              pvsSN: payload
            },
            'User entered PVS SN scanning a QR code'
          )
        )
      )
    )
  )

const trackTimeScanning = (action$, state$) =>
  action$.pipe(
    ofType(SCANNING_START.getType()),
    switchMap(() => {
      if (state$.value.site.siteChanged) {
        window.mixpanel.time_event('Scan PVS Tag')
      }
      return EMPTY
    })
  )

export default [
  enterSNManuallyEpic,
  scanPVSCameraEpic,
  trackTimeScanning,
  connectedViaBLE
]
