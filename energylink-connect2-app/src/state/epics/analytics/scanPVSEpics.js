import { ofType } from 'redux-observable'
import { map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators'
import { interval, ReplaySubject } from 'rxjs'
import {
  CONNECT_PVS_CAMERA,
  CONNECT_PVS_MANUALLY,
  START_SCANNING
} from 'state/actions/analytics'
import { EMPTY_ACTION } from 'state/actions/share'
import { scanPVS } from 'shared/analytics'

const timeConnectingToPVS$ = new ReplaySubject(1)

export const getTimeTrackingPVSEpic = action$ => {
  return action$.pipe(
    ofType(START_SCANNING.getType()),
    switchMap(() => {
      timeConnectingToPVS$.next(0)
      return interval(1000).pipe(
        map(secondsPassed => {
          timeConnectingToPVS$.next(secondsPassed)
          return EMPTY_ACTION('SECONDS PASSED TRACKING CONNECTION TIME')
        }),
        takeUntil(
          action$.pipe(
            ofType(CONNECT_PVS_MANUALLY.getType(), CONNECT_PVS_CAMERA.getType())
          )
        )
      )
    })
  )
}
const enterSNManuallyEpic = action$ => {
  timeConnectingToPVS$.next(0)
  return action$.pipe(
    ofType(CONNECT_PVS_MANUALLY.getType()),
    withLatestFrom(timeConnectingToPVS$),
    map(([{ payload }, timePassed]) => {
      const data = [payload, 'Manual', timePassed]

      return scanPVS(data, 'User entered PVS SN manually')
    })
  )
}

const scanPVSCameraEpic = action$ =>
  action$.pipe(
    ofType(CONNECT_PVS_CAMERA.getType()),
    withLatestFrom(timeConnectingToPVS$),
    map(([{ payload }, timePassed]) => {
      const data = [payload, 'QR Code', timePassed]

      return scanPVS(data, 'User entered PVS SN scanning a QR code')
    })
  )

export default [getTimeTrackingPVSEpic, enterSNManuallyEpic, scanPVSCameraEpic]
