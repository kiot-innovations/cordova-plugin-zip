import { always, cond, equals, includes, lte, T } from 'ramda'
import { ofType } from 'redux-observable'
import { EMPTY, of, ReplaySubject } from 'rxjs'
import { exhaustMap, switchMap, withLatestFrom } from 'rxjs/operators'

import { firmwareUpdateEvent, timeMixPanelEvent } from 'shared/analytics'
import {
  SHOW_FIRMWARE_UPDATE_MODAL,
  FIRMWARE_UPDATE_COMPLETE,
  FIRMWARE_UPDATE_ERROR,
  INIT_FIRMWARE_UPDATE
} from 'state/actions/firmwareUpdate'

const wasUpdateSuccessful = includes('COMPLETE FIRMWARE UPDATE')

const getFWName = cond([
  [lte(10000), always('New Unknown')],
  [lte(9000), always('Daggit')],
  [equals(8616), always('Cylon 1.1.2')],
  [lte(8614), always('Cylon 1.1')],
  [lte(8000), always('Cylon')],
  [lte(7000), always('Boomer')],
  [lte(6415), always('Adama 0.15')],
  [lte(6393), always('Adama 0.14')],
  [lte(6389), always('Adama 0.13')],
  [lte(6388), always('Adama 0.12')],
  [lte(6362), always('Adama 0.11')],
  [lte(6000), always('Adama')],
  [T, always('Archived Unknown')]
])

const fromPVSVersion$ = new ReplaySubject(1)

export const getPvsFirmwareUpdateVersions = action$ =>
  action$.pipe(
    ofType(SHOW_FIRMWARE_UPDATE_MODAL.getType()),
    switchMap(({ payload }) => {
      fromPVSVersion$.next({ ...payload })
      return EMPTY
    })
  )

const firmwareUpdateAnalytics = action$ =>
  action$.pipe(
    ofType(FIRMWARE_UPDATE_COMPLETE.getType(), FIRMWARE_UPDATE_ERROR.getType()),
    withLatestFrom(fromPVSVersion$),
    exhaustMap(([{ type }, firmwareInfo]) => {
      const { PVSFromVersion, PVSToVersion } = firmwareInfo
      return of(
        firmwareUpdateEvent({
          fromFWVersion: getFWName(PVSFromVersion),
          fromBuildNumber: PVSFromVersion,
          toFWVersion: getFWName(PVSToVersion),
          toBuildNumber: PVSToVersion,
          success: wasUpdateSuccessful(type)
        })
      )
    })
  )

const startTrackingTime = action$ =>
  action$.pipe(
    ofType(INIT_FIRMWARE_UPDATE.getType()),
    switchMap(() => {
      timeMixPanelEvent('Firmware Update')
      return EMPTY
    })
  )

export default [
  firmwareUpdateAnalytics,
  getPvsFirmwareUpdateVersions,
  startTrackingTime
]
