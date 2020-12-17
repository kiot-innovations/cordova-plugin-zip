import { ofType } from 'redux-observable'
import { map, switchMap } from 'rxjs/operators'
import {
  CONNECT_PVS_CAMERA,
  CONNECT_PVS_MANUALLY,
  SCANNING_START
} from 'state/actions/analytics'
import { scanPVS } from 'shared/analytics'
import { EMPTY } from 'rxjs'

const enterSNManuallyEpic = action$ => {
  return action$.pipe(
    ofType(CONNECT_PVS_MANUALLY.getType()),
    map(({ payload }) =>
      scanPVS(
        { entryMethod: 'Manual', pvsSN: payload },
        'User entered PVS SN manually'
      )
    )
  )
}

const scanPVSCameraEpic = action$ =>
  action$.pipe(
    ofType(CONNECT_PVS_CAMERA.getType()),
    map(({ payload }) =>
      scanPVS(
        {
          entryMethod: 'QR Code',
          pvsSN: payload
        },
        'User entered PVS SN scanning a QR code'
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

export default [enterSNManuallyEpic, scanPVSCameraEpic, trackTimeScanning]
