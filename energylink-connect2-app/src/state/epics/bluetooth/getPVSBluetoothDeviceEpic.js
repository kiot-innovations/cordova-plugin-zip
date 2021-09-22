import { isEmpty, path } from 'ramda'
import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { getBLEDevice } from 'shared/bluetooth/getBluetoothDevice'
import { TAGS } from 'shared/utils'
import {
  ENABLE_ACCESS_POINT,
  CONNECT_PVS_VIA_BLE,
  FAILURE_BLUETOOTH_ACTION
} from 'state/actions/network'

export const getPVSBluetoothDeviceEpic = (action$, state$) => {
  return action$.pipe(
    ofType(ENABLE_ACCESS_POINT.getType()),
    mergeMap(({ payload: deviceSN }) => {
      const { serialNumber } = path(['value', 'pvs'], state$)
      return getBLEDevice(deviceSN || serialNumber).pipe(
        mergeMap(({ devices }) =>
          isEmpty(devices)
            ? of(FAILURE_BLUETOOTH_ACTION())
            : of(...devices.map(CONNECT_PVS_VIA_BLE))
        ),
        catchError(err => {
          Sentry.addBreadcrumb({ message: 'GET_BLE_DEVICE' })
          Sentry.setTag(TAGS.KEY.PVS, TAGS.VALUE.BLE_DEVICE_SCAN_ERROR)
          Sentry.captureException(err)
          return of(FAILURE_BLUETOOTH_ACTION())
        })
      )
    })
  )
}
